package vn.edu.fu.newsmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fu.newsmanagement.pojos.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
}