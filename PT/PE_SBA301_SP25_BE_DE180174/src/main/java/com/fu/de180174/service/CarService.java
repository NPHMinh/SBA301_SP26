package com.fu.de180174.service;

import com.fu.de180174.dto.CarDTO;
import com.fu.de180174.entity.Cars;
import com.fu.de180174.repository.CarsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {
    private final CarsRepository repo;

    public CarService(CarsRepository repo) {
        this.repo = repo;
    }

    public List<CarDTO> getAllCars() {
        return repo.findAllWithCountry().stream().map(c -> {
            CarDTO dto = new CarDTO();
            dto.setCarID(c.getCarID());
            dto.setCarName(c.getCarName());
            dto.setCountryID(c.getCountryID());
            dto.setCountryName(c.getCountry().getCountryName());
            dto.setUnitsInStock(c.getUnitsInStock());
            dto.setUnitPrice(c.getUnitPrice());
            dto.setCreatedAt(c.getCreatedAt());
            dto.setUpdatedAt(c.getUpdatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public CarDTO addCar(CarDTO dto) {
        Cars car = new Cars();
        car.setCarName(dto.getCarName());
        car.setCountryID(dto.getCountryID());
        car.setUnitsInStock(dto.getUnitsInStock());
        car.setUnitPrice(dto.getUnitPrice());
        car.setCreatedAt(dto.getCreatedAt());
        car.setUpdatedAt(dto.getUpdatedAt());
        Cars saved = repo.save(car);
        dto.setCarID(saved.getCarID());
        return dto;
    }

    public void deleteCar(int id) {
        repo.deleteById(id);
    }

    public CarDTO updateCar(int id, CarDTO dto) {
        Cars car = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        car.setCarName(dto.getCarName());
        car.setCountryID(dto.getCountryID());
        car.setUnitsInStock(dto.getUnitsInStock());
        car.setUnitPrice(dto.getUnitPrice());
        car.setCreatedAt(dto.getCreatedAt());
        car.setUpdatedAt(dto.getUpdatedAt());
        repo.save(car);
        return dto;
    }
}
