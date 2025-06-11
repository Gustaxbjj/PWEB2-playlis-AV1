create table produto(
id_produto int,
nome varchar(50),
data date,
primary key(id_produto)
);

create table pedido(
id_pedido int,
nome varchar(50),
data date,
primary key(id_pedido)
);

create table produtopedido(
FK_id_produto int,
FK_id_pedido int,
foreign key(FK_id_produto) references produto(id_produto),
foreign key(FK_id_pedido) references pedido(id_pedido),
primary key(FK_id_produto,FK_id_pedido)
);