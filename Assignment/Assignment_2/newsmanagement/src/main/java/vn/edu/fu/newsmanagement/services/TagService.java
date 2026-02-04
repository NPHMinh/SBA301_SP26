package vn.edu.fu.newsmanagement.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.fu.newsmanagement.pojos.Tag;
import vn.edu.fu.newsmanagement.repositories.TagRepository;

import java.util.List;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Tag createTag(Tag tag) {
        tag.setTagId(null);
        return tagRepository.save(tag);
    }
}