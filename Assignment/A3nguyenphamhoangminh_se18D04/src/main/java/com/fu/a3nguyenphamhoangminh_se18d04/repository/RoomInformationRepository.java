package com.fu.a3nguyenphamhoangminh_se18d04.repository;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {
}