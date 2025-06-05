create table history(
    idx serial primary key,
    file varchar(256) default '',
    time timestamp default now(),
    bearing int default 0,
    state varchar(32) default ''
);