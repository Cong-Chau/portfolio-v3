package com.portfolio.server.repository;

import com.portfolio.server.entity.AboutDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AboutDetailRepository extends JpaRepository<AboutDetail, Long> {
    List<AboutDetail> findAllByOrderByOrderIndexAsc();
}
