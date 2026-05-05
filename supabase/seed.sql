insert into public.categories (name, emoji, color_hex, sort_order) values
('Isda', '🐟', '#0D9488', 1),
('Karne', '🥩', '#EF4444', 2),
('Gulay', '🥬', '#22C55E', 3),
('Prutas', '🍋', '#FBBF24', 4),
('Itlog at Manok', '🥚', '#F59E0B', 5),
('Sangkap', '🧄', '#F97316', 6),
('Paninda', '🛒', '#A855F7', 7),
('Inumin', '🧃', '#38BDF8', 8)
on conflict do nothing;

insert into public.products (category_id, name, description, unit, price, stock_qty, low_stock_threshold, barcode) values
((select id from public.categories where name='Isda'), 'Bangus', 'Sariwang bangus per kilo.', 'kg', 180, 28, 5, '89900000001'),
((select id from public.categories where name='Isda'), 'Tilapia', 'Bagong huling tilapia.', 'kg', 120, 35, 5, '89900000002'),
((select id from public.categories where name='Isda'), 'Galunggong', 'Pang-prito na galunggong.', 'kg', 200, 18, 5, '89900000003'),
((select id from public.categories where name='Isda'), 'Pusit', 'Malinis at sariwang pusit.', 'kg', 350, 7, 5, '89900000004'),
((select id from public.categories where name='Isda'), 'Hipon', 'Medium hipon per kilo.', 'kg', 400, 6, 5, '89900000005'),
((select id from public.categories where name='Karne'), 'Baboy liempo', 'Liempo pang-ihaw.', 'kg', 320, 20, 5, '89900000006'),
((select id from public.categories where name='Karne'), 'Baka', 'Beef cubes per kilo.', 'kg', 380, 14, 5, '89900000007'),
((select id from public.categories where name='Karne'), 'Manok', 'Whole chicken cutups.', 'kg', 210, 26, 5, '89900000008'),
((select id from public.categories where name='Karne'), 'Pork kasim', 'Kasim pang-adobo.', 'kg', 300, 15, 5, '89900000009'),
((select id from public.categories where name='Karne'), 'Longganisa', 'Matamis na longganisa.', 'tali', 95, 32, 10, '89900000010'),
((select id from public.categories where name='Gulay'), 'Kangkong', 'Fresh bundle ng kangkong.', 'bundle', 20, 80, 10, '89900000011'),
((select id from public.categories where name='Gulay'), 'Ampalaya', 'Ampalaya per piraso.', 'pc', 35, 45, 10, '89900000012'),
((select id from public.categories where name='Gulay'), 'Kamatis', 'Hinog na kamatis.', 'kg', 60, 22, 5, '89900000013'),
((select id from public.categories where name='Gulay'), 'Talong', 'Talong per piraso.', 'pc', 25, 55, 10, '89900000014'),
((select id from public.categories where name='Gulay'), 'Sitaw', 'Bundle ng sitaw.', 'bundle', 30, 38, 10, '89900000015'),
((select id from public.categories where name='Prutas'), 'Saging Lakatan', 'Dozen ng lakatan.', 'dozen', 120, 18, 5, '89900000016'),
((select id from public.categories where name='Prutas'), 'Mangga', 'Matamis na mangga.', 'kg', 80, 30, 5, '89900000017'),
((select id from public.categories where name='Prutas'), 'Papaya', 'Papaya per piraso.', 'pc', 45, 21, 10, '89900000018'),
((select id from public.categories where name='Prutas'), 'Pakwan hiwa', 'Pakwan sliced pack.', 'pc', 35, 24, 10, '89900000019'),
((select id from public.categories where name='Prutas'), 'Calamansi', 'Calamansi per kilo.', 'kg', 90, 12, 5, '89900000020'),
((select id from public.categories where name='Itlog at Manok'), 'Itlog', 'Fresh egg per piece.', 'pc', 8, 240, 24, '89900000021'),
((select id from public.categories where name='Itlog at Manok'), 'Itlog', 'Fresh egg dozen.', 'dozen', 90, 30, 5, '89900000022'),
((select id from public.categories where name='Itlog at Manok'), 'Chicken paa', 'Chicken leg quarters.', 'kg', 180, 17, 5, '89900000023'),
((select id from public.categories where name='Itlog at Manok'), 'Chicken pakpak', 'Chicken wings.', 'kg', 190, 12, 5, '89900000024'),
((select id from public.categories where name='Itlog at Manok'), 'Balut', 'Balut per piraso.', 'pc', 22, 60, 12, '89900000025'),
((select id from public.categories where name='Sangkap'), 'Bawang 100g', 'Bawang pack.', 'pc', 30, 42, 10, '89900000026'),
((select id from public.categories where name='Sangkap'), 'Luya', 'Luya per piraso.', 'pc', 15, 65, 10, '89900000027'),
((select id from public.categories where name='Sangkap'), 'Sibuyas', 'Sibuyas per kilo.', 'kg', 70, 24, 5, '89900000028'),
((select id from public.categories where name='Sangkap'), 'Sili', 'Sili bundle.', 'bundle', 25, 34, 10, '89900000029'),
((select id from public.categories where name='Sangkap'), 'Paminta sachet', 'Black pepper sachet.', 'pc', 12, 90, 20, '89900000030'),
((select id from public.categories where name='Paninda'), 'Asin pack', 'Iodized salt pack.', 'pc', 15, 75, 20, '89900000031'),
((select id from public.categories where name='Paninda'), 'Toyo 350ml', 'Soy sauce bottle.', 'liter', 45, 36, 10, '89900000032'),
((select id from public.categories where name='Paninda'), 'Patis 350ml', 'Fish sauce bottle.', 'liter', 40, 32, 10, '89900000033'),
((select id from public.categories where name='Paninda'), 'Suka 350ml', 'Vinegar bottle.', 'liter', 35, 38, 10, '89900000034'),
((select id from public.categories where name='Paninda'), 'Mantika 1L', 'Cooking oil bottle.', 'liter', 105, 20, 8, '89900000035'),
((select id from public.categories where name='Inumin'), 'Softdrinks 1.5L', 'Assorted soda.', 'liter', 75, 30, 8, '89900000036'),
((select id from public.categories where name='Inumin'), 'Mineral water', 'Bottled water.', 'pc', 25, 48, 12, '89900000037'),
((select id from public.categories where name='Inumin'), 'Juice tetra pack', 'Assorted juice pack.', 'pc', 20, 64, 12, '89900000038'),
((select id from public.categories where name='Inumin'), 'Buko juice', 'Fresh buko juice.', 'pc', 35, 28, 8, '89900000039'),
((select id from public.categories where name='Inumin'), 'Iced tea litro', 'Iced tea litro.', 'liter', 65, 22, 8, '89900000040')
on conflict (barcode) do nothing;

insert into public.vendors (name, stall_no, contact, specialization) values
('Aling Nena', 'A1', '0917-111-2222', 'Isda'),
('Mang Rolly', 'B2', '0918-333-4444', 'Karne'),
('Aling Tess', 'C3', '0919-555-6666', 'Gulay')
on conflict do nothing;

insert into public.discounts (name, type, value, is_active) values
('Walang discount', 'fixed', 0, true),
('Suki 5%', 'percent', 5, true),
('Senior/PWD 20%', 'percent', 20, true),
('Tawad ₱10', 'fixed', 10, true)
on conflict do nothing;
