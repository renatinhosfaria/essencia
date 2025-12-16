-- Adds optional phone column to users table
-- Safe to run multiple times
alter table if exists users
  add column if not exists phone text;
