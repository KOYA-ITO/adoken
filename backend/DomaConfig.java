package com.example.backend;

import org.seasar.doma.jdbc.Config;
import org.seasar.doma.jdbc.dialect.PostgresDialect;

import javax.sql.DataSource;

public class DomaConfig implements Config {

    @Override
    public PostgresDialect getDialect() {
        return new PostgresDialect();  // PostgreSQL用のDialect
    }

    @Override
    public DataSource getDataSource() {
        return null;  // コード生成時は使用しないため null でOK
    }
}