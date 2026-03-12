package com.automotriz.api.repository;

import com.automotriz.api.entity.VersionMultimedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersionMultimediaRepository extends JpaRepository<VersionMultimedia, Long> {
}
