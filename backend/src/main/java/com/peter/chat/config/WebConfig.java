package com.peter.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")  // React app URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Add necessary HTTP methods
                .allowedHeaders("*")  // Allow all headers, you can restrict it as needed
                .allowCredentials(true);  // If you are using cookies or authentication
    }
}
