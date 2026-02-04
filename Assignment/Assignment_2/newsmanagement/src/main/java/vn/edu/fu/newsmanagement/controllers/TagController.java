package vn.edu.fu.newsmanagement.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.edu.fu.newsmanagement.pojos.Tag;
import vn.edu.fu.newsmanagement.services.TagService;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping
    public List<Tag> getAllTags() {
        return tagService.getAllTags();
    }

    @PostMapping
    public Tag createTag(@RequestBody Tag tag) {
        return tagService.createTag(tag);
    }
}