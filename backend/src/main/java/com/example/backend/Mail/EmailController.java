package com.example.backend.Mail;


import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/sendEmail")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @GetMapping("/reset")
    public ResponseEntity<String> sendEmailChangePassword(@RequestParam("email") String email) throws MessagingException, IOException {
        try {
            emailService.sendEmailChangePassword(email);
            return ResponseEntity.ok("Email sent");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }

}