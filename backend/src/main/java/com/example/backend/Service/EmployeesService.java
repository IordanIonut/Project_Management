package com.example.backend.Service;

import com.example.backend.Model.Class.Employees;
import com.example.backend.Model.Class.User;
import com.example.backend.Repository.EmployeesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmployeesService {
    @Autowired
    private EmployeesRepository employeesRepository;

    public void saveAll(List<Employees> employees){
        this.employeesRepository.saveAll(employees);
    }

    public void save(Employees employee) {
        this.employeesRepository.save(employee);
    }

    public List<Employees> findAll(){
        return this.employeesRepository.findAll();
    }

    public Set<String> getAllNames() {
        return employeesRepository.findAll().stream()
                .map(Employees::getName)
                .collect(Collectors.toSet());
    }

    public Optional<Employees> findById(String id){
        return this.employeesRepository.findById(id);
    }
}
