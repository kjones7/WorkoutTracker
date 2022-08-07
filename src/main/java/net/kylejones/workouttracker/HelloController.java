package net.kylejones.workouttracker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/main")
    public String hello() {
        return "Hello!";
    }
}