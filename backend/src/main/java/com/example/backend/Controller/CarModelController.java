package com.example.backend.Controller;

import com.example.backend.Model.Class.CarModel;
import com.example.backend.Model.Class.Cars;
import com.example.backend.Model.Class.User;
import com.example.backend.Model.Dto.FindByRequestDTO;
import com.example.backend.Service.CarModelService;
import com.example.backend.Utility.GroupedResult;
import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/car/model")
@JBossLog
public class CarModelController {
    @Autowired
    private CarModelService carModelService;

    @GetMapping("/find-search/by")
    public ResponseEntity<List<CarModel>> findByName(@RequestParam("name") final String name) {
        try {
            log.info("findByName() - Successful.....");
            return ResponseEntity.ok(this.carModelService.findByName(name));
        } catch (Exception e) {
            log.error("Error in findByName: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/find/all")
    public ResponseEntity<List<CarModel>> findAllCarModels() {
        try {
            log.info("findAllCarModels() - Successful.....");
            return ResponseEntity.ok(this.carModelService.findAllCarModels());
        } catch (Exception e) {
            log.error("Error in findAllCarModels: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/find-by")
    public ResponseEntity<GroupedResult> postCarModelByCarModelFilter(@RequestBody FindByRequestDTO requestDTO) {
        try {
            log.info("findAllCarModel() - Successful.....");
            return ResponseEntity.ok(new GroupedResult(this.carModelService.findCarModelByCarModelFilter(requestDTO.getTableRequest(), requestDTO.getCarModelFilterDTO()), this.carModelService.countCarModelByCarModelFilter(requestDTO.getCarModelFilterDTO())));
        } catch (Exception e) {
            log.error("Error in findAllCarModel: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/excel-by")
    public ResponseEntity<List<Object[]>> excelCarModelByCarModelFilter(@RequestParam("column") final String column, @RequestBody FindByRequestDTO requestDTO) {
        try {
            log.info("excelCarModelByCarModelFilter() - Successful.....");
            return ResponseEntity.ok(this.carModelService.excelCarModelByCarModelFilter(column, requestDTO.getCarModelFilterDTO()));
        } catch (Exception e) {
            log.error("Error in excelCarModelByCarModelFilter: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Void> save(@RequestBody CarModel carModel){
        try {
            log.info("save() - Successful.....");
            this.carModelService.save(carModel);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in save: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete-by")
    public ResponseEntity<Void> delete(@RequestParam("id") String id){
        try {
            log.info("delete() - Successful.....");
            this.carModelService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in delete: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
