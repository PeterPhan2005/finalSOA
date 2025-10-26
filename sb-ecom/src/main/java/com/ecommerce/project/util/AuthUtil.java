package com.ecommerce.project.util;

import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    private static final Logger logger = LoggerFactory.getLogger(AuthUtil.class);

    @Autowired
    UserRepository userRepository;

    public String loggedInEmail(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        logger.debug("=== loggedInEmail called ===");
        logger.debug("Authentication object: {}", authentication);
        logger.debug("Is authenticated: {}", authentication != null ? authentication.isAuthenticated() : "null");
        logger.debug("Principal: {}", authentication != null ? authentication.getPrincipal() : "null");
        logger.debug("Name: {}", authentication != null ? authentication.getName() : "null");
        
        if (authentication == null || !authentication.isAuthenticated() 
            || "anonymousUser".equals(authentication.getPrincipal())) {
            logger.error("User is not authenticated!");
            throw new UsernameNotFoundException("User is not authenticated");
        }
        
        String username = authentication.getName();
        logger.debug("Looking up user by username: {}", username);
        
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        logger.debug("Found user: {} with email: {}", user.getUserName(), user.getEmail());
        return user.getEmail();
    }

    public Long loggedInUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() 
            || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UsernameNotFoundException("User is not authenticated");
        }
        
        User user = userRepository.findByUserName(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + authentication.getName()));

        return user.getUserId();
    }

    public User loggedInUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        logger.debug("=== loggedInUser called ===");
        logger.debug("Authentication object: {}", authentication);
        logger.debug("Is authenticated: {}", authentication != null ? authentication.isAuthenticated() : "null");
        logger.debug("Principal: {}", authentication != null ? authentication.getPrincipal() : "null");
        logger.debug("Name: {}", authentication != null ? authentication.getName() : "null");

        if (authentication == null || !authentication.isAuthenticated() 
            || "anonymousUser".equals(authentication.getPrincipal())) {
            logger.error("User is not authenticated!");
            throw new UsernameNotFoundException("User is not authenticated");
        }

        String username = authentication.getName();
        logger.debug("Looking up user by username: {}", username);

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        
        logger.debug("Found user: {} with ID: {}", user.getUserName(), user.getUserId());
        return user;

    }


}