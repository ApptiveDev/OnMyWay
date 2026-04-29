INSERT INTO service_category (id, name) VALUES (1, '한잔') ON CONFLICT (id) DO NOTHING;
INSERT INTO service_category (id, name) VALUES (2, '한입') ON CONFLICT (id) DO NOTHING;
INSERT INTO service_category (id, name) VALUES (3, '한숨') ON CONFLICT (id) DO NOTHING;
INSERT INTO service_category (id, name) VALUES (4, '한판') ON CONFLICT (id) DO NOTHING;
INSERT INTO service_category (id, name) VALUES (5, '한눈') ON CONFLICT (id) DO NOTHING;
INSERT INTO service_category (id, name) VALUES (6, '한끼') ON CONFLICT (id) DO NOTHING;

/*
-- 카카오 카테고리 매핑
INSERT INTO category_mapping (source, api_category, service_category_id)
VALUES ('KAKAO', '카페', 1);

INSERT INTO category_mapping (source, api_category, service_category_id)
VALUES ('KAKAO', '음식점', 2);
 */