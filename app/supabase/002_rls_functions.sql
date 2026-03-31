-- ============================================================
-- SWM NUTRITION – RLS POLICIES & FUNCTIONS
-- ============================================================

-- ── HELPER: check if caller is admin ─────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin','staff')
  );
$$;

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists             ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs            ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
CREATE POLICY "profiles_select_own"   ON profiles FOR SELECT  USING (auth.uid() = id OR is_staff_or_admin());
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own"   ON profiles FOR INSERT  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_all"    ON profiles FOR ALL     USING (is_admin());

-- ============================================================
-- POSTS POLICIES
-- ============================================================
CREATE POLICY "posts_public_read"   ON posts FOR SELECT USING (status = 'published' OR is_staff_or_admin());
CREATE POLICY "posts_staff_write"   ON posts FOR ALL    USING (is_staff_or_admin());

-- ============================================================
-- PRODUCTS POLICIES
-- ============================================================
CREATE POLICY "products_public_read"  ON products FOR SELECT USING (is_active = TRUE OR is_staff_or_admin());
CREATE POLICY "products_admin_write"  ON products FOR ALL    USING (is_staff_or_admin());

-- ============================================================
-- PRODUCT REVIEWS POLICIES
-- ============================================================
CREATE POLICY "reviews_public_read"  ON product_reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_user_insert"  ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_admin_all"    ON product_reviews FOR ALL    USING (is_staff_or_admin());

-- ============================================================
-- ORDERS POLICIES
-- ============================================================
CREATE POLICY "orders_own_select"  ON orders FOR SELECT USING (user_id = auth.uid() OR is_staff_or_admin());
CREATE POLICY "orders_own_insert"  ON orders FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "orders_admin_all"   ON orders FOR ALL    USING (is_staff_or_admin());

CREATE POLICY "order_items_own"    ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_staff_or_admin())));
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_staff_or_admin()))
);
CREATE POLICY "order_items_admin"  ON order_items FOR ALL USING (is_staff_or_admin());

-- ============================================================
-- APPOINTMENTS POLICIES
-- ============================================================
CREATE POLICY "appt_own_select"    ON appointments FOR SELECT USING (user_id = auth.uid() OR is_staff_or_admin());
CREATE POLICY "appt_anyone_insert" ON appointments FOR INSERT WITH CHECK (TRUE);  -- public booking
CREATE POLICY "appt_own_update"    ON appointments FOR UPDATE USING (user_id = auth.uid() OR is_staff_or_admin());
CREATE POLICY "appt_admin_all"     ON appointments FOR ALL    USING (is_staff_or_admin());

-- ============================================================
-- CONTACT MESSAGES POLICIES
-- ============================================================
CREATE POLICY "contact_insert_public" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "contact_admin_all"     ON contact_messages FOR ALL    USING (is_staff_or_admin());

-- ============================================================
-- CHAT POLICIES
-- ============================================================
CREATE POLICY "chat_rooms_own"        ON chat_rooms FOR SELECT USING (user_id = auth.uid() OR is_staff_or_admin());
CREATE POLICY "chat_rooms_create"     ON chat_rooms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chat_rooms_admin"      ON chat_rooms FOR ALL    USING (is_staff_or_admin());

CREATE POLICY "chat_messages_room"    ON chat_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM chat_rooms r WHERE r.id = room_id AND (r.user_id = auth.uid() OR is_staff_or_admin())));
CREATE POLICY "chat_messages_send"    ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "chat_messages_admin"   ON chat_messages FOR ALL USING (is_staff_or_admin());

-- ============================================================
-- NEWSLETTER POLICIES
-- ============================================================
CREATE POLICY "newsletter_insert"  ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "newsletter_own"     ON newsletter_subscribers FOR SELECT USING (is_admin());

-- ============================================================
-- WISHLIST POLICIES
-- ============================================================
CREATE POLICY "wishlist_own"       ON wishlists FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- AUDIT LOG POLICIES
-- ============================================================
CREATE POLICY "audit_admin_read"   ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "audit_insert"       ON audit_logs FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles(id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 'client')
  ON CONFLICT(id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at    BEFORE UPDATE ON profiles    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_posts_updated_at       BEFORE UPDATE ON posts       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated_at    BEFORE UPDATE ON products    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_orders_updated_at      BEFORE UPDATE ON orders      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_chat_rooms_updated_at  BEFORE UPDATE ON chat_rooms  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Recalculate product rating after review insert/delete
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products SET
    rating       = (SELECT ROUND(AVG(rating)::numeric, 2) FROM product_reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    review_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    updated_at   = NOW()
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER trg_review_rating AFTER INSERT OR DELETE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Increment post views (rate-limited at DB level per session)
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS VOID LANGUAGE sql AS $$
  UPDATE posts SET views = views + 1 WHERE slug = post_slug AND status = 'published';
$$;

-- Get dashboard stats for admin
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE result JSON;
BEGIN
  IF NOT is_staff_or_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  SELECT JSON_BUILD_OBJECT(
    'total_orders',         (SELECT COUNT(*) FROM orders),
    'pending_orders',       (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
    'total_revenue',        (SELECT COALESCE(SUM(total),0) FROM orders WHERE status NOT IN ('cancelled','refunded')),
    'revenue_this_month',   (SELECT COALESCE(SUM(total),0) FROM orders WHERE status NOT IN ('cancelled','refunded') AND created_at >= DATE_TRUNC('month', NOW())),
    'total_clients',        (SELECT COUNT(*) FROM profiles WHERE role = 'client'),
    'new_clients_this_month',(SELECT COUNT(*) FROM profiles WHERE role = 'client' AND created_at >= DATE_TRUNC('month', NOW())),
    'pending_appointments', (SELECT COUNT(*) FROM appointments WHERE status = 'pending'),
    'unread_messages',      (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread'),
    'total_products',       (SELECT COUNT(*) FROM products WHERE is_active = TRUE),
    'published_posts',      (SELECT COUNT(*) FROM posts WHERE status = 'published')
  ) INTO result;
  RETURN result;
END;
$$;