package vn.edu.fu.newsmanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                // Thiết lập các server (Môi trường dev, product...)
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Server")
                ))
                // Thiết lập thông tin chung về API
                .info(new Info()
                        .title("FU News Management API")
                        .version("1.0.0")
                        .description("Tài liệu API cho dự án quản lý tin tức"));
    }
}