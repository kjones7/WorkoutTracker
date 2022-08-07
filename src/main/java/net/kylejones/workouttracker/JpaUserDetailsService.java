package net.kylejones.workouttracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String username) {
        Supplier<UsernameNotFoundException> s =
            () -> new UsernameNotFoundException(
                "Problem during authentication!");

        User u = userRepository
                .findUserByUsername(username)
                .orElseThrow(s);

        return new CustomUserDetails(u);
    }
}