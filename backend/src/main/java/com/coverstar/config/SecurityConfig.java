package com.coverstar.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableAutoConfiguration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    @Lazy
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf().disable()
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers(
                        "/webjars/**",
                        "/peritable/**",
                        "/sign-up/**",
                        "/verify-code/**",
                        "/sign-in/**",
                        "/assets/**",
                        "/forgot-password/**",
                        "/unlock-account/**",
                        "/images/**",
                        "/notifications/**",
                        "/ws/**"
                ).permitAll()
                .antMatchers(
                        "/account/change-password",
                        "/change-email",
                        "/account/*",
                        "/productTypes/search",
                        "/productTypes/getAllProductTypesByStatus",
                        "/productTypes/getProductsByProductTypeId/*",
                        "/address/**",
                        "/comments/**",
                        "/categories/getAllCategory",
                        "/categories/getCategoryById/*",
                        "/categories/getCategorysByProductTypeId",
                        "/locations/**",
                        "/products/search",
                        "/products/getProduct/*",
                        "/products/getDiscountedPrice/*",
                        "/purchases/**",
                        "/payments/**",
                        "/carts/**"
                ).hasAnyRole("ADMIN", "MEMBER")
                .antMatchers(
                        "/admin/**",
                        "/discounts/**",
                        "/productTypes/admin/**",
                        "/categories/admin/**",
                        "/products/admin/**",
                        "/dashboards/**"
                        ).hasRole("ADMIN")
                .anyRequest().authenticated();
    }

    @Bean
    public static PasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
