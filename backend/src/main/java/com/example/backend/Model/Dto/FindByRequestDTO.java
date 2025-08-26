package com.example.backend.Model.Dto;

import com.example.backend.Utility.TableRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FindByRequestDTO {
	private TableRequest tableRequest;
	private ProcessLogsFilterDTO processLogsFilterDTO;
	private CarsFiltersDTO carsFiltersDTO;
	private QualityChecksFiltersDTO qualityChecksFiltersDTO;
	private CarsPartsFiltersDTO carsPartsFiltersDTO;
	private MachineUsedFiltersDTO machineUsedFiltersDTO;
	private PartProductionFiltersDTO partProductionFiltersDTO;
	private MachineFiltersDTO machineFiltersDTO;
	private UserAllFiltersDTO userAllFiltersDTO;
	private MachineAllFiltersDTO machineAllFiltersDTO;
}
