package com.portfolio.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		loadDotenv();
		SpringApplication.run(ServerApplication.class, args);
	}

	/**
	 * Tự động đọc file .env ở local (nếu có) và nạp vào System Properties
	 * giúp chạy trực tiếp trên IntelliJ/VS Code mà không cần cài thêm plugin.
	 */
	private static void loadDotenv() {
		File[] candidateFiles = new File[]{
				new File(".env"),
				new File("server/.env"),
				new File("../server/.env")
		};

		for (File file : candidateFiles) {
			if (file.exists() && file.isFile()) {
				try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
					String line;
					while ((line = reader.readLine()) != null) {
						line = line.trim();
						if (line.isEmpty() || line.startsWith("#")) continue;

						int equalsIndex = line.indexOf('=');
						if (equalsIndex > 0) {
							String key = line.substring(0, equalsIndex).trim();
							String value = line.substring(equalsIndex + 1).trim();

							// Xóa dấu nháy kép hoặc nháy đơn nếu có
							if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
								value = value.substring(1, value.length() - 1);
							} else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
								value = value.substring(1, value.length() - 1);
							}

							// Chỉ nạp nếu biến môi trường hệ thống chưa có
							if (System.getProperty(key) == null && System.getenv(key) == null) {
								System.setProperty(key, value);
							}
						}
					}
				} catch (IOException ignored) {
				}
				break;
			}
		}
	}
}
