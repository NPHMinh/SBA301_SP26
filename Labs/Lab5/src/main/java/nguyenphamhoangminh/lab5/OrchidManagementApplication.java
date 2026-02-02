package nguyenphamhoangminh.lab5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrchidManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrchidManagementApplication.class, args);
		System.out.println("🌸 Orchid Management System is running!");
		System.out.println("📡 Backend API: http://localhost:8080");
		System.out.println("📚 API Docs: http://localhost:8080/api/orchids");
	}
}
