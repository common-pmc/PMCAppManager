// Функции за групиране
export function groupAdminFiles(files = []) {
  return files.reduce((acc, file) => {
    const company = file.company?.companyName || "Без фирма";
    const department = file.department?.departmentName || "Без отдел";
    const product = file.productName || "Без продукт";
    const productType = file.productType || "Други";

    if (!acc[company]) {
      acc[company] = {};
    }

    if (!acc[company][department]) {
      acc[company][department] = {};
    }

    if (!acc[company][department][product]) {
      acc[company][department][product] = {};
    }

    if (!acc[company][department][product][productType]) {
      acc[company][department][product][productType] = [];
    }

    acc[company][department][product][productType].push(file);

    return acc;
  }, {});
}

export function groupUserFiles(files) {
  return files.reduce((acc, file) => {
    const department = file.department?.name || "Общи файлове";
    const product = file.productName || "Без продукт";
    const productType = file.productType || "Други";

    if (!acc[department]) {
      acc[department] = {};
    }

    if (!acc[department][product]) {
      acc[department][product] = {};
    }

    if (!acc[department][product][productType]) {
      acc[department][product][productType] = [];
    }

    acc[department][product][productType].push(file);

    return acc;
  }, {});
}
