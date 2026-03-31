-- ============================================================
-- SWM NUTRITION – SEED DATA
-- ============================================================

-- ── PRODUCTS ─────────────────────────────────────────────────
INSERT INTO products (slug, name, short_desc, category, price, original_price, stock_quantity, images, rating, review_count, is_featured, key_features, ingredients, how_to_use) VALUES

('premium-multivitamin', 'Premium Multivitamin Complex',
 'Comprehensive daily vitamin and mineral supplement tailored for Kenyan diets',
 'Supplements', 2500, 3500, 150,
 ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&q=85&auto=format&fit=crop'],
 4.8, 324, TRUE,
 ARRAY['23 essential vitamins & minerals','Enhanced with probiotics','Non-GMO & gluten-free','Third-party tested','60-day supply'],
 'Vitamin A 900mcg, Vitamin C 90mg, Vitamin D3 25mcg, Vitamin E 15mg, Zinc 11mg, Magnesium 100mg, Selenium 55mcg.',
 'Take 1 capsule daily with a meal.'),

('omega-3-fish-oil', 'Omega-3 Fish Oil Capsules',
 'High-quality omega-3 supplement for heart and brain health',
 'Supplements', 1800, NULL, 200,
 ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&q=80&auto=format&fit=crop'],
 4.7, 98, FALSE,
 ARRAY['1000mg per capsule','EPA + DHA','Enteric coated','No fishy aftertaste','90 capsules'],
 'Fish Oil Concentrate 1000mg (EPA 360mg, DHA 240mg), Gelatin, Glycerin.',
 'Take 1–2 capsules daily with food.'),

('probiotic-supplement', 'Probiotic Supplement',
 'Support digestive health with premium probiotic strains',
 'Supplements', 2200, NULL, 80,
 ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&q=80&auto=format&fit=crop'],
 4.6, 112, FALSE,
 ARRAY['10 billion CFU per capsule','6 probiotic strains','Shelf stable','Vegan capsule','30-day supply'],
 'Lactobacillus acidophilus, Bifidobacterium longum, Lactobacillus rhamnosus.',
 'Take 1 capsule daily on an empty stomach.'),

('30-day-meal-plan', '30-Day Personalized Meal Plan',
 'Custom meal plan designed specifically for your health goals',
 'Meal Plans', 5000, NULL, 999,
 ARRAY['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&q=85&auto=format&fit=crop'],
 5.0, 89, TRUE,
 ARRAY['Fully customized to your goals','Shopping list included','Recipe collection','Macro breakdown','Local ingredients'],
 NULL, 'After purchase, complete the intake form. Your plan is delivered within 48 hours.'),

('athlete-performance-plan', 'Athlete Performance Plan',
 'Specialized nutrition plan for sports performance optimization',
 'Meal Plans', 7500, NULL, 999,
 ARRAY['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=85&auto=format&fit=crop'],
 4.9, 73, FALSE,
 ARRAY['Pre & post workout nutrition','Hydration protocol','Race day strategy','Recovery meals','Weekly adjustments'],
 NULL, 'Complete sports assessment form after purchase.'),

('initial-consultation', 'Initial Nutrition Consultation',
 '60-minute one-on-one consultation with comprehensive health assessment',
 'Consultations', 3500, NULL, 999,
 ARRAY['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=85&auto=format&fit=crop'],
 4.9, 156, TRUE,
 ARRAY['60-minute session','Health assessment','Personalized plan outline','Supplement recommendations','Follow-up email'],
 NULL, 'Book your preferred time after checkout.'),

('monthly-followup', 'Monthly Follow-Up Package',
 '4 follow-up sessions with plan adjustments and support',
 'Consultations', 8000, 10000, 999,
 ARRAY['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80&auto=format&fit=crop'],
 4.8, 91, FALSE,
 ARRAY['4 x 30-min sessions','Plan adjustments','Progress tracking','WhatsApp support','Monthly report'],
 NULL, 'Sessions scheduled weekly after purchase.'),

('weight-management-program', 'Weight Management Program',
 '12-week comprehensive program with weekly check-ins',
 'Wellness', 15000, 20000, 50,
 ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=85&auto=format&fit=crop'],
 5.0, 67, TRUE,
 ARRAY['12-week structured program','Weekly check-ins','Behavioral coaching','Custom meal plans','Body composition tracking'],
 NULL, 'Program kicks off with an in-depth assessment call.'),

('wellness-starter-kit', 'Wellness Starter Kit',
 'Combination of essential supplements and nutrition guide',
 'Wellness', 4500, 6000, 35,
 ARRAY['https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=700&q=85&auto=format&fit=crop'],
 4.7, 145, FALSE,
 ARRAY['Multivitamin (30-day supply)','Omega-3 (30-day supply)','Nutrition guide PDF','Meal planning template','Free 15-min call'],
 NULL, 'Ships within 2 business days in Nairobi.');

-- ── BLOG POSTS ────────────────────────────────────────────────
INSERT INTO posts (slug, title, excerpt, content, cover_image, category, tags, status, featured, read_time, published_at) VALUES

('understanding-macronutrients',
 'Understanding Macronutrients: A Complete Guide for Kenyans',
 'Learn how proteins, carbs, and fats work together to fuel your body with locally available foods.',
 '<h2>What Are Macronutrients?</h2><p>Macronutrients are the three primary classes of nutrients that provide energy: proteins, carbohydrates, and fats. Understanding how each functions helps you make smarter food choices using ingredients from your local Kenyan market.</p><h2>Proteins</h2><p>Essential for muscle repair, immune function, and hormone production. Great local sources include omena (silver fish), beans, lentils, eggs, and chicken.</p><h2>Carbohydrates</h2><p>Your body''s primary fuel source. Choose complex carbs like sweet potatoes (viazi vitamu), ugali from whole maize, brown rice, and green bananas (matoke) for sustained energy.</p><h2>Fats</h2><p>Critical for brain health, hormone production, and absorbing fat-soluble vitamins. Healthy sources include avocado (parachichi), coconut oil, nuts, and fatty fish from Lake Victoria.</p>',
 'https://images.unsplash.com/photo-1609197100049-373be8d93f56?w=1200&q=85&auto=format&fit=crop',
 'Nutrition', ARRAY['macronutrients','basics','kenya'], 'published', TRUE, '5 min read', NOW() - INTERVAL '2 days'),

('10-superfoods-kenya',
 '10 Superfoods Available in Kenyan Markets',
 'Discover powerful, nutrient-dense foods you can find locally to boost your health naturally.',
 '<h2>Kenya''s Nutritional Treasure Chest</h2><p>You don''t need expensive imported supplements when your local market is packed with superfoods. Here are 10 powerful options available right in Kenya.</p><h2>1. Moringa (Mrenda)</h2><p>Called the "miracle tree," moringa leaves are rich in vitamins A, C, and K, plus iron and calcium. Add fresh leaves to soups or dry and powder them for smoothies.</p><h2>2. Sweet Potatoes (Viazi Vitamu)</h2><p>High in beta-carotene, fiber, and potassium. A staple across Kenya that deserves its superfood status.</p><h2>3. Omena (Silver Fish)</h2><p>One of the most nutrient-dense proteins available in Kenya — packed with omega-3s, calcium, and vitamin D at a fraction of the cost of imported fish.</p>',
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85&auto=format&fit=crop',
 'Nutrition', ARRAY['superfoods','local foods','health'], 'published', FALSE, '7 min read', NOW() - INTERVAL '5 days'),

('meal-prep-nairobi',
 'Meal Prep for Busy Professionals in Nairobi',
 'Time-saving strategies to maintain healthy eating habits even with a demanding schedule.',
 '<h2>Why Meal Prep Works</h2><p>Traffic, long work hours, and a fast-paced Nairobi lifestyle make it hard to eat well consistently. Meal prep solves this by investing 2–3 hours on Sunday for healthy meals all week.</p><h2>Getting Started</h2><p>Start simple: cook a large batch of rice or ugali, roast a tray of vegetables, and prepare two protein sources like boiled eggs and cooked chicken. Store in airtight containers in the fridge.</p><h2>Budget-Friendly Tips</h2><p>Buy seasonal vegetables in bulk from Wakulima Market or your local mama mboga. Shop on Saturday evenings for the best prices on fresh produce.</p>',
 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=85&auto=format&fit=crop',
 'Recipes', ARRAY['meal prep','recipes','nairobi'], 'published', FALSE, '6 min read', NOW() - INTERVAL '8 days');