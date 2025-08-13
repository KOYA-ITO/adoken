package com.backend.config;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.backend.handler.CustomAuthenticationFailureHandler;
import com.backend.handler.CustomAuthenticationSuccessHandler;
import com.backend.handler.CustomLogoutSuccessHandler;

	

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final UserDetailsService userDetailsService; //追加
    //パスワードエンコーダも実装予定
    
    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }
    
    
    //自作ハンドラーのインポート
    @Autowired
    private CustomAuthenticationSuccessHandler loginSuccessHandler;
    @Autowired
    private CustomAuthenticationFailureHandler loginFailureHandler;
    @Autowired
    private CustomLogoutSuccessHandler logoutSuccessHandler;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        //要変更、現状はハッシュ化を行わずにパスワードを平文で比較することに。必ず変更する。
        return NoOpPasswordEncoder.getInstance();
    }
    
    //SecurityFilterChainのBean定義
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
        .csrf(csrf -> csrf.disable())
        
        .cors(cors -> cors
                .configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000"));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    corsConfiguration.setAllowCredentials(true);
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    return corsConfiguration;
                }))
        
        
        .authorizeHttpRequests(authz -> authz      // HTTPリクエストに対するセキュリティ設定
        		.requestMatchers("/login").permitAll()
        	    .requestMatchers("/api/auth/login").permitAll()   // ← 追加
        	    .requestMatchers("/api/auth/check").permitAll()   // ← 追加（Controllerで200/401返す方式なら必須）
        	    .anyRequest().authenticated()
    )
        .formLogin(form -> form                    //　フォームベースのログイン設定
                //.loginPage("/LoginPages/V101_login")             // カスタムのログインページを指定
                //※上記はサーバーサイドレンダリングではないため不要
                .loginProcessingUrl("/api/auth/login") // [追加] ログイン処理apiのURLを指定
                .usernameParameter("username")    // [追加] ユーザー名inputのname属性を指定
                .passwordParameter("password")    // [追加] パスワードinputのname属性を指定
                .successHandler(loginSuccessHandler)   // [追加] ログイン成功時のレスポンスステータス
                .failureHandler(loginFailureHandler)   // [追加] ログイン失敗時のレスポンスステータス
                .permitAll()
    )
        .logout(logout -> logout
                .logoutUrl("/api/auth/logout")             //ログアウトAPIのURL
                .logoutSuccessHandler(logoutSuccessHandler)  //ログイン時のレスポンスステータス
                .invalidateHttpSession(true) // セッションを無効化
                .deleteCookies("JSESSIONID") // Cookieも削除
    )
        .exceptionHandling(ex -> ex
        	    .defaultAuthenticationEntryPointFor(
        	        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
        	        new AntPathRequestMatcher("/api/**")
        	    )
        	);
    
        return http.build();
    }
}

