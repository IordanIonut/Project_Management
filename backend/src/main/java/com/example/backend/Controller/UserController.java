package com.example.backend.Controller;

import com.example.backend.Model.Class.User;
import com.example.backend.Model.Dto.FindByRequestDTO;
import com.example.backend.Model.Dto.UserInformationDTO;
import com.example.backend.Service.UserService;
import com.example.backend.Utility.GroupedResult;
import com.mysql.cj.x.protobuf.MysqlxCrud;
import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/user")
@JBossLog
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/information")
    public ResponseEntity<UserInformationDTO> countInformation(@RequestParam("name") final String name, @RequestParam("machine_name_or_id") final String machine_name_or_id) {
        try {
            log.info("countInformation() - Successful.....");
            return ResponseEntity.ok(this.userService.countInformation(name, machine_name_or_id));
        } catch (Exception e) {
            log.error("Error in countInformation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/find/by")
    public ResponseEntity<User> findUserByUsernameOrId(@RequestParam("user_username_or_id_or_email") final String user_username_or_id_or_email) {
        try {
            log.info("findUserByUsernameOrId() - Successful.....");
            return ResponseEntity.ok(this.userService.findUserByUsernameOrId(user_username_or_id_or_email));
        } catch (Exception e) {
            log.error("Error in findUserByUsernameOrId: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/can-access")
    public ResponseEntity<Boolean> canAccessPage(@RequestParam("user_username_or_id_or_email") final String user_username_or_id_or_email) {
        try {
            log.info("canAccessPage() - Successful.....");
            return ResponseEntity.ok(this.userService.canAccessPage(user_username_or_id_or_email));
        } catch (Exception e) {
            log.error("Error in canAccessPage: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/find-search/by")
    public ResponseEntity<List<User>> findUsersByUsername(@RequestParam("user_username") final String user_username) {
        try {
            log.info("findUsersByUsername() - Successful.....");
            return ResponseEntity.ok(this.userService.findUsersByUsername(user_username));
        } catch (Exception e) {
            log.error("Error in findUsersByUsername: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/find-email/by")
    public ResponseEntity<Optional<User>> findByEmail(@RequestParam("email") final String email) {
        try {
            log.info("findByEmail() - Successful.....");
            return ResponseEntity.ok(this.userService.findByEmail(email));
        } catch (Exception e) {
            log.error("Error in findByEmail: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Void> save(@RequestBody User user) {
        try {
            log.info("save() - Successful.....");
            this.userService.save(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in save: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/find-all/by")
    public ResponseEntity<GroupedResult> findAllByUserAllFilters(@RequestBody FindByRequestDTO requestDTO) {
        try {
            log.info("findAllByUserAllFilters() - Successful.....");
            return ResponseEntity.ok(new GroupedResult(this.userService.findAllByUserAllFilters(requestDTO.getTableRequest(), requestDTO.getUserAllFiltersDTO()), this.userService.countAllByUserAllFilters(requestDTO.getUserAllFiltersDTO())));
        } catch (Exception e) {
            log.error("Error in findAllByUserAllFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/excel-all/by")
    public ResponseEntity<List<Object[]>> excelAllByUserAllFilters(@RequestParam("columns") final String columns, @RequestBody FindByRequestDTO requestDTO) {
        try {
            log.info("excelAllByUserAllFilters() - Successful.....");
            return ResponseEntity.ok(this.userService.excelAllByUserAllFilters(columns,requestDTO.getUserAllFiltersDTO()));
        } catch (Exception e) {
            log.error("Error in excelAllByUserAllFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete-by")
    public ResponseEntity<Void> deleteUser(@RequestParam("id") String id){
        try {
            log.info("deleteUser() - Successful.....");
            this.userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in deleteUser: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
