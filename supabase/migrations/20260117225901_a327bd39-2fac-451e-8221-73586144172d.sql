-- Inserir produtos para o usuário existente
INSERT INTO produtos (user_id, nome, descricao) VALUES
  ('fdd1a5be-58c6-488c-bce9-96161199dc4e', 'Camiseta Básica', 'Camiseta 100% algodão'),
  ('fdd1a5be-58c6-488c-bce9-96161199dc4e', 'Calça Jeans', 'Calça jeans tradicional'),
  ('fdd1a5be-58c6-488c-bce9-96161199dc4e', 'Tênis Esportivo', 'Tênis para corrida'),
  ('fdd1a5be-58c6-488c-bce9-96161199dc4e', 'Boné', 'Boné ajustável'),
  ('fdd1a5be-58c6-488c-bce9-96161199dc4e', 'Mochila', 'Mochila escolar 30L');

-- Inserir movimentações (entradas e saídas)
INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'entrada',
  50,
  CURRENT_DATE - INTERVAL '10 days'
FROM produtos p WHERE p.nome = 'Camiseta Básica';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'saida',
  12,
  CURRENT_DATE - INTERVAL '5 days'
FROM produtos p WHERE p.nome = 'Camiseta Básica';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'entrada',
  30,
  CURRENT_DATE - INTERVAL '8 days'
FROM produtos p WHERE p.nome = 'Calça Jeans';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'saida',
  25,
  CURRENT_DATE - INTERVAL '2 days'
FROM produtos p WHERE p.nome = 'Calça Jeans';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'entrada',
  20,
  CURRENT_DATE - INTERVAL '7 days'
FROM produtos p WHERE p.nome = 'Tênis Esportivo';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'saida',
  18,
  CURRENT_DATE - INTERVAL '1 day'
FROM produtos p WHERE p.nome = 'Tênis Esportivo';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'entrada',
  100,
  CURRENT_DATE - INTERVAL '6 days'
FROM produtos p WHERE p.nome = 'Boné';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'entrada',
  15,
  CURRENT_DATE - INTERVAL '4 days'
FROM produtos p WHERE p.nome = 'Mochila';

INSERT INTO movimentacoes (user_id, produto_id, tipo, quantidade, data) 
SELECT 
  'fdd1a5be-58c6-488c-bce9-96161199dc4e',
  p.id,
  'saida',
  3,
  CURRENT_DATE
FROM produtos p WHERE p.nome = 'Mochila';