package com.example.aiethicssurvey;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AiEthicsSurveyApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiEthicsSurveyApplication.class, args);
    }
}