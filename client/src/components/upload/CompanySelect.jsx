import React from "react";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";

const CompanySelect = ({
  companies,
  departments,
  selectedCompany,
  setSelectedCompany,
  selectedDepartment,
  setSelectedDepartment,
}) => {
  const selectedCompanyObj =
    companies.find((c) => c.id === selectedCompany) || null;

  const selectedDepartmentObj =
    departments.find((d) => d.id === selectedDepartment) || null;

  return (
    <>
      <Autocomplete
        options={companies}
        value={selectedCompanyObj}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.companyName || ""}
        onChange={(event, newValue) => {
          const companyId = newValue ? newValue.id : "";

          setSelectedCompany(companyId);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Избери фирма"
            variant="standard"
            fullWidth
            required
            InputProps={{
              ...params.InputProps,

              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <BusinessIcon
                      sx={{
                        mr: 1,
                        verticalAlign: "middle",
                      }}
                    />
                  </InputAdornment>

                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {departments.length > 0 && (
        <Autocomplete
          options={departments}
          value={selectedDepartmentObj}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.departmentName || ""}
          onChange={(event, newValue) => {
            setSelectedDepartment(newValue ? newValue.id : "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Избери отдел"
              variant="standard"
              fullWidth
              required
              InputProps={{
                ...params.InputProps,

                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <ApartmentIcon
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                        }}
                      />
                    </InputAdornment>

                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default CompanySelect;
