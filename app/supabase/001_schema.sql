-- ============================================================
-- SWM NUTRITION – COMPLETE SUPABASE SCHEMA
-- Run in order: schema → RLS → functions → triggers → seed
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ───────────────────────────────────────────────────
CREATE TYPE order_status       AS ENUM ('pending','paid','processing','shipped','delivered','cancelled','refunded');
CREATE TYPE appointment_status AS ENUM ('pending','confirmed','completed','cancelled','no_show');
CREATE TYPE message_status     AS ENUM ('unread','read','replied','archived');
CREATE TYPE product_category   AS ENUM ('Supplements','Meal Plans','Consultations','Wellness');
CREATE TYPE post_status        AS ENUM ('draft','published','archived');
CREATE TYPE user_role          AS ENUM ('admin','staff','client');

-- ============================================================
-- PROFILES  (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role    DEFAULT 'client',
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  date_of_birth DATE,
  city          TEXT,
  country       TEXT         DEFAULT 'Kenya',
  bio           TEXT,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE posts (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT         UNIQUE NOT NULL,
  title         TEXT         NOT NULL,
  excerpt       TEXT,
  content       TEXT         NOT NULL,
  cover_image   TEXT,
  category      TEXT         NOT NULL,
  tags          TEXT[]       DEFAULT '{}',
  author_id     UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  status        post_status  DEFAULT 'draft',
  featured      BOOLEAN      DEFAULT FALSE,
  read_time     TEXT,
  views         INTEGER      DEFAULT 0,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_posts_slug       ON posts(slug);
CREATE INDEX idx_posts_status     ON posts(status);
CREATE INDEX idx_posts_category   ON posts(category);
CREATE INDEX idx_posts_published  ON posts(published_at DESC NULLS LAST);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id              UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT             UNIQUE NOT NULL,
  name            TEXT             NOT NULL,
  description     TEXT,
  short_desc      TEXT,
  category        product_category NOT NULL,
  price           NUMERIC(10,2)    NOT NULL CHECK (price >= 0),
  original_price  NUMERIC(10,2),
  sku             TEXT             UNIQUE,
  stock_quantity  INTEGER          DEFAULT 0,
  images          TEXT[]           DEFAULT '{}',
  tags            TEXT[]           DEFAULT '{}',
  rating          NUMERIC(3,2)     DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count    INTEGER          DEFAULT 0,
  is_active       BOOLEAN          DEFAULT TRUE,
  is_featured     BOOLEAN          DEFAULT FALSE,
  key_features    TEXT[]           DEFAULT '{}',
  ingredients     TEXT,
  how_to_use      TEXT,
  metadata        JSONB            DEFAULT '{}',
  created_at      TIMESTAMPTZ      DEFAULT NOW(),
  updated_at      TIMESTAMPTZ      DEFAULT NOW()
);
CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active   ON products(is_active);

-- ============================================================
-- PRODUCT REVIEWS
-- ============================================================
CREATE TABLE product_reviews (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  reviewer    TEXT        NOT NULL,
  avatar_url  TEXT,
  rating      INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT        NOT NULL,
  is_verified BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    TEXT         UNIQUE NOT NULL DEFAULT 'SWM-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8)),
  user_id         UUID         REFERENCES profiles(id) ON DELETE SET NULL,
  -- Snapshot of customer info at order time
  customer_name   TEXT         NOT NULL,
  customer_email  TEXT         NOT NULL,
  customer_phone  TEXT,
  -- Delivery
  shipping_address JSONB       DEFAULT '{}',
  -- Financials
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_fee    NUMERIC(10,2) DEFAULT 0,
  discount        NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Status
  status          order_status DEFAULT 'pending',
  payment_method  TEXT,
  payment_ref     TEXT,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_orders_user    ON orders(user_id);
CREATE INDEX idx_orders_status  ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID        REFERENCES products(id) ON DELETE SET NULL,
  -- Snapshot at purchase time
  name        TEXT        NOT NULL,
  image       TEXT,
  price       NUMERIC(10,2) NOT NULL,
  quantity    INTEGER     NOT NULL CHECK (quantity > 0),
  subtotal    NUMERIC(12,2) GENERATED ALWAYS AS (price * quantity) STORED
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- APPOINTMENTS / CONSULTATIONS
-- ============================================================
CREATE TABLE appointments (
  id              UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref             TEXT               UNIQUE DEFAULT 'APT-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6)),
  user_id         UUID               REFERENCES profiles(id) ON DELETE SET NULL,
  -- Client info (supports non-auth bookings)
  client_name     TEXT               NOT NULL,
  client_email    TEXT               NOT NULL,
  client_phone    TEXT,
  -- Booking details
  service_type    TEXT               NOT NULL,
  mode            TEXT               NOT NULL DEFAULT 'virtual' CHECK (mode IN ('in_person','virtual')),
  scheduled_at    TIMESTAMPTZ        NOT NULL,
  duration_mins   INTEGER            DEFAULT 60,
  -- Workflow
  status          appointment_status DEFAULT 'pending',
  notes           TEXT,
  admin_notes     TEXT,
  meeting_link    TEXT,
  reminder_sent   BOOLEAN            DEFAULT FALSE,
  created_at      TIMESTAMPTZ        DEFAULT NOW(),
  updated_at      TIMESTAMPTZ        DEFAULT NOW()
);
CREATE INDEX idx_appt_user      ON appointments(user_id);
CREATE INDEX idx_appt_status    ON appointments(status);
CREATE INDEX idx_appt_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appt_email     ON appointments(client_email);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT           NOT NULL,
  email       TEXT           NOT NULL,
  phone       TEXT,
  service     TEXT,
  message     TEXT           NOT NULL,
  status      message_status DEFAULT 'unread',
  replied_at  TIMESTAMPTZ,
  reply_text  TEXT,
  ip_address  INET,
  created_at  TIMESTAMPTZ    DEFAULT NOW()
);
CREATE INDEX idx_contact_status  ON contact_messages(status);
CREATE INDEX idx_contact_created ON contact_messages(created_at DESC);

-- ============================================================
-- CHAT / REALTIME MESSAGES
-- ============================================================
CREATE TABLE chat_rooms (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT        DEFAULT 'Support Chat',
  is_open     BOOLEAN     DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chat_user ON chat_rooms(user_id);

CREATE TABLE chat_messages (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id     UUID        NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  is_admin    BOOLEAN     DEFAULT FALSE,
  is_read     BOOLEAN     DEFAULT FALSE,
  metadata    JSONB       DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chat_msg_room    ON chat_messages(room_id);
CREATE INDEX idx_chat_msg_created ON chat_messages(created_at);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT        UNIQUE NOT NULL,
  is_active    BOOLEAN     DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE wishlists (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE audit_logs (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT        NOT NULL,
  table_name  TEXT,
  record_id   TEXT,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_user    ON audit_logs(user_id);
CREATE INDEX idx_audit_table   ON audit_logs(table_name);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);