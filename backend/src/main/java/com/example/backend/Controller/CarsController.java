package com.example.backend.Controller;

import com.example.backend.Model.Class.Cars;
import com.example.backend.Model.Class.Machines;
import com.example.backend.Model.Dto.CarsFiltersDTO;
import com.example.backend.Model.Dto.CountViewDTO;
import com.example.backend.Model.Dto.FindByRequestDTO;
import com.example.backend.Model.Enum.CarsStatus;
import com.example.backend.Service.CarsService;
import com.example.backend.Utility.GroupedResult;
import com.example.backend.Utility.TableRequest;
import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/cars")
@JBossLog
public class CarsController {
    @Autowired
    private CarsService carsService;

    @PostMapping("/find/by")
    public ResponseEntity<GroupedResult> postDataByUserNameAndCarsFilters(@RequestParam(value = "name", required = false) final String name, @RequestBody FindByRequestDTO request) {
        try {
            log.info("postDataByUserNameAndCarsFilters() - Successful.....");
            TableRequest tableRequest = request.getTableRequest();
            CarsFiltersDTO carsFiltersDTO = request.getCarsFiltersDTO();
            return ResponseEntity.ok(new GroupedResult(this.carsService.findByUsernameAndCarsFilters(name, tableRequest, carsFiltersDTO), this.carsService.countByUsernameAndCarsFilters(name, carsFiltersDTO)));
        } catch (Exception e) {
            log.error("Error in postDataByUserNameAndCarsFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/count/by")
    public ResponseEntity<Long> countByUsernameAndCarsFilters(@RequestParam(value = "name", required = false) final String name, @RequestBody FindByRequestDTO request) {
        try {
            log.info("countByUsernameAndCarsFilters() - Successful.....");
            CarsFiltersDTO carsFiltersDTO = request.getCarsFiltersDTO();
            return ResponseEntity.ok(this.carsService.countByUsernameAndCarsFilters(name, carsFiltersDTO));
        } catch (Exception e) {
            log.error("Error in countByUsernameAndCarsFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/excel/find/by")
    public ResponseEntity<List<Object[]>> postExcelByUserNameAncCarsFilter(@RequestParam(value = "name", required = false) final String name, @RequestParam("columns") final String columns, @RequestBody FindByRequestDTO request) {
        try {
            log.info("postExcelByUserNameAncCarsFilter() - Successful.....");
            CarsFiltersDTO carsFiltersDTO = request.getCarsFiltersDTO();
            return ResponseEntity.ok(this.carsService.getExcelByUserNameCarsFilters(name, columns, carsFiltersDTO));
        } catch (Exception e) {
            log.error("Error in postExcelByUserNameAncCarsFilter: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/dialog/by")
    public ResponseEntity<List<CountViewDTO>> countStatusByCarModelId(@RequestParam("carModelId") final String carModelId) {
        try {
            log.info("countStatusByCarModelId() - Successful.....");
            return ResponseEntity.ok(this.carsService.countStatusByCarModelId(carModelId));
        } catch (Exception e) {
            log.error("Error in countStatusByCarModelId: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/find/by")
    public ResponseEntity<Cars> findCarsByVinOrIdOrName(@RequestParam("car_vin_or_id_or_name") final String car_vin_or_id_or_name) {
        try {
            log.info("findCarsByVinOrId() - Successful.....");
            return ResponseEntity.ok(this.carsService.findCarsByVinOrIdOrName(car_vin_or_id_or_name));
        } catch (Exception e) {
            log.error("Error in findCarsByVinOrId: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/put/status")
    public ResponseEntity<Integer> updateCarsStatus(@RequestParam("car_vin_or_id") final String car_vin_or_id, @RequestParam("status") final CarsStatus status) {
        try {
            log.info("updateCarsStatus() - Successful.....");
            return ResponseEntity.ok(this.carsService.updateCarsStatus(car_vin_or_id, status));
        } catch (Exception e) {
            log.error("Error in updateCarsStatus: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/can-access")
    public ResponseEntity<Boolean> canAccessPage(@RequestParam("car_vin_or_id_or_name") final String car_vin_or_id_or_name, @RequestParam("username") final String username) {
        try {
            log.info("canAccessPage() - Successful.....");
            return ResponseEntity.ok(this.carsService.canAccessPage(car_vin_or_id_or_name, username));
        } catch (Exception e) {
            log.error("Error in canAccessPage: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Void> save(@RequestBody Cars cars){
        try {
            log.info("save() - Successful.....");
            this.carsService.save(cars);
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
            this.carsService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in delete: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
