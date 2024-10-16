import Icon from "@mui/material/Icon";
import DirectorDashboard from "layouts/dashboard-director";
import DeputyDirectorDashboard from "layouts/dashboard-dd";
import ProductManagerDashboard from "layouts/dashboard-pm";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import userRoles from "constants/userRoles";
import DirectorAdd from "layouts/dashboard-director/components/director-add";
import DeputyDirectorAdd from "layouts/dashboard-dd/components/dd-add-pm";
import ProductManagerAdd from "layouts/dashboard-pm/components/pm-add";
import FieldForceManagerAdd from "layouts/dashboard-ff/components/ff-add";
import FieldForceManagerDashboard from "layouts/dashboard-ff";
import RegionalManagerAdd from "layouts/dashboard-rm/components/rm-add";
import MedicalRepresentativeDashboard from "layouts/dashboard-mr";
import DeputyDirectorPms from "layouts/dashboard-dd/components/dd-pms";
import DDProductManager from "layouts/dashboard-dd/components/dd-single-pm";
import DeputyDirectorAddFieldForce from "layouts/dashboard-dd/components/dd-add-ff";
import DeputyDirectorSinglePM from "layouts/dashboard-dd/components/dd-single-pm";
import DeputyDirectorAddRegionalManager from "layouts/dashboard-dd/components/dd-add-rm";
import DeputyDirectorAddMedicalRepresentative from "layouts/dashboard-dd/components/dd-add-mr";
import DeputyDirectorMrs from "layouts/dashboard-dd/components/dd-mrs";
import DeputyDirectorAddNotification from "layouts/dashboard-dd/components/dd-add-ntfc";
import DeputyDirectorAddProductCategory from "layouts/dashboard-dd/components/dd-add-product-category";
import DeputyDirectorCategories from "layouts/dashboard-dd/components/dd-categories";
import DeputyDirectorManufacturerCompanies from "layouts/dashboard-dd/components/dd-mnfcts";
import DeputyDirectorAddManufacturerCompany from "layouts/dashboard-dd/components/dd-add-mnfct";
import DeputyDirectorProducts from "layouts/dashboard-dd/components/dd-products";
import DeputyDirectorAddProduct from "layouts/dashboard-dd/components/dd-add-product";
import DeputyDirectorRegions from "layouts/dashboard-dd/components/dd-regions";
import DeputyDirectorAddRegion from "layouts/dashboard-dd/components/dd-add-region";
import DeputyDirectorMedicalOrganizations from "layouts/dashboard-dd/components/dd-medorg";
import DeputyDirectorAddMedicalOrganization from "layouts/dashboard-dd/components/dd-add-medorg";
import DeputyDirectorAddSpeciality from "layouts/dashboard-dd/components/dd-add-speciality";
import DeputyDirectorSpecialities from "layouts/dashboard-dd/components/dd-specialities";
import DeputyDirectorAddDoctorPlan from "layouts/dashboard-dd/components/dd-add-doctor-plan";
import DeputyDirectorAddPharmacyPlan from "layouts/dashboard-dd/components/dd-add-pharmacy-plan";
import DeputyDirectorMRInfo from "layouts/dashboard-dd/components/dd-mr-info";
import DeputyDirectorAddPharmacy from "layouts/dashboard-dd/components/dd-add-pharmacy";
import DeputyDirectorAddDoctor from "layouts/dashboard-dd/components/dd-add-doctor";
import DeputyDirectorAddCategory from "layouts/dashboard-dd/components/dd-add-ctgr";
import DeputyDirectorProductCategories from "layouts/dashboard-dd/components/dd-product-categories";
import WholesaleManagerDashboard from "layouts/dashboard-ws";
import WholesaleManagerCompanies from "layouts/dashboard-ws/components/ws-companies";
import WholesaleManagerAddCompany from "layouts/dashboard-ws/components/ws-company-add";
import DeputyDirectorAddProductPlan from "layouts/dashboard-dd/components/dd-add-product-plan";
import WholesaleManagerProducts from "./layouts/dashboard-ws/components/ws-produtcs";
import WholesaleManagerAddProduct from "./layouts/dashboard-ws/components/ws-add-product";
import HeadOfOrdersDashboard from "layouts/dashboard-head";
import HeadOfOrdersFactoryWarehouses from "layouts/dashboard-head/components/head-factory-warehouses";
import HeadofOrdersAddWarehouseData from "layouts/dashboard-head/components/head-add-warehouse-data";
import HeadReservations from "layouts/dashboard-head/components/head-reservations";
import WholesaleReports from "layouts/dashboard-ws/components/ws-reports";
import WholesaleReportDetails from "layouts/dashboard-ws/components/ws-report-details";
import WholesaleAddSale from "layouts/dashboard-ws/components/ws-add-sale";
import WholesaleAddPharmacy from "layouts/dashboard-ws/components/ws-add-pharmacy";
import WholesaleProductDetails from "layouts/dashboard-ws/components/ws-product-report";
import WholesaleAddBalanceInStock from "layouts/dashboard-ws/components/ws-add-balance-in-stock";
import DeputyDirectorEditProductExpenses from "layouts/dashboard-dd/components/dd-edit-product-expenses";
import ProductManagerProducts from "layouts/dashboard-pm/components/pm-products";
import DeputyDirectorProcessReports from "layouts/dashboard-dd/components/dd-process-reports";
import DeputyDirectorBonus from "layouts/dashboard-dd/components/dd-bonus";
import DeputyDirectorBonusMrs from "layouts/dashboard-dd/components/dd-bonus-mrs";
import DeputyDirectorAddBonus from "layouts/dashboard-dd/components/dd-add-bonus";
import HeadSetDiscount from "layouts/dashboard-head/components/head-set-discount";
import HeadSetInvoiceNumber from "layouts/dashboard-head/components/head-set-invoice-number";
import DeputyDirectorDoctors from "layouts/dashboard-dd/components/dd-doctors";
import ReservationAdd from "layouts/dashboard-head/components/head-add-reservation";
import HeadPayReservation from "layouts/dashboard-head/components/head-pay-reservation";
import WholesaleManagerAddReservation from "layouts/dashboard-ws/components/ws-add-reservation";
import DeputyDirectorBonusHistory from "layouts/dashboard-dd/components/dd-bonus-history";
import HeadPayReservationPharmacy from "layouts/dashboard-head/components/head-pay-reservation-pharmacy";
import HeadPayReservationWholesale from "layouts/dashboard-head/components/head-pay-reservation-wholesale";
import HeadPayReservationHospital from "layouts/dashboard-head/components/head-pay-reservation-hospital";
import DeputyDirectorUpdateDoctor from "layouts/dashboard-dd/components/dd-update-doctor";
import DeputyDirectorDoctorDatabase from "./layouts/dashboard-dd/components/dd-doctor-database";
import HeadReturnProduct from "layouts/dashboard-head/components/head-return-product";
import DeputyDirectorUpdateProduct from "layouts/dashboard-dd/components/dd-update-product";
import DeputyDirectorDebts from "layouts/dashboard-dd/components/dd-debts";
import DeputyDirectorMrsMonitoring from "layouts/dashboard-dd/components/dd-mr-monitoring";
import DeputyDirectorLoginMonitoring from "layouts/dashboard-dd/components/dd-monitoring";
import DeputyDirectorStatistics from "layouts/dashboard-dd/components/dd-statistics";

const roleBasedRoutes = [
  {
    role: [userRoles.DIRECTOR],
    path: "director",
    routes: [
      { path: "dashboard", component: <DirectorDashboard /> },
      { path: "mrs", component: <DeputyDirectorMrs /> },
      { path: "products", component: <DeputyDirectorProducts /> },
      { path: "process-reports", component: <DeputyDirectorProcessReports /> },
      { path: "doctors", component: <DeputyDirectorDoctors /> },
      // { path: "add", component: <DirectorAdd /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Медицинские представители",
        key: "dd-mrs",
        icon: <Icon fontSize="small">support_agent</Icon>,
        route: "mrs",
      },
      {
        type: "collapse",
        name: "Продукты",
        key: "dd-products",
        icon: <Icon fontSize="small">inventory</Icon>,
        route: "products",
      },
      {
        type: "collapse",
        name: "Список врачей",
        key: "doctors",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "doctors",
      },
      {
        type: "collapse",
        name: "Процесс отчеты",
        key: "dd-process-reports",
        icon: <Icon fontSize="small">summarize_two_tone_icon</Icon>,
        route: "process-reports",
      },
      // {
      //   type: "collapse",
      //   name: "Панель управления",
      //   key: "dashboard-director",
      //   icon: <Icon fontSize="small">dashboard</Icon>,
      //   route: "dashboard",
      // },
      // {
      //   type: "collapse",
      //   name: "Добавить нового пользователя",
      //   key: "director-add",
      //   icon: <Icon fontSize="small">add</Icon>,
      //   route: "add",
      // },
    ],
  },
  {
    role: [userRoles.DEPUTY_DIRECTOR, userRoles.PRODUCT_MANAGER, userRoles.DIRECTOR],
    path: "dd",
    routes: [
      { path: "dashboard", component: <DeputyDirectorDashboard /> },
      { path: "statistics", component: <DeputyDirectorStatistics /> },
      { path: "add-pm", component: <DeputyDirectorAdd /> },
      { path: "pms", component: <DeputyDirectorPms /> },
      { path: "single-pm", component: <DeputyDirectorSinglePM /> },
      { path: "add-ff", component: <DeputyDirectorAddFieldForce /> },
      { path: "add-rm", component: <DeputyDirectorAddRegionalManager /> },
      { path: "add-mr", component: <DeputyDirectorAddMedicalRepresentative /> },
      { path: "mrs", component: <DeputyDirectorMrs /> },
      { path: "add-notification", component: <DeputyDirectorAddNotification /> },
      { path: "categories", component: <DeputyDirectorCategories /> },
      { path: "add-category", component: <DeputyDirectorAddCategory /> },
      { path: "product-categories", component: <DeputyDirectorProductCategories /> },
      { path: "add-product-category", component: <DeputyDirectorAddProductCategory /> },
      { path: "manufacturer-companies", component: <DeputyDirectorManufacturerCompanies /> },
      { path: "add-manufacturer-company", component: <DeputyDirectorAddManufacturerCompany /> },
      { path: "products", component: <DeputyDirectorProducts /> },
      { path: "update-product", component: <DeputyDirectorUpdateProduct /> },
      { path: "add-product", component: <DeputyDirectorAddProduct /> },
      { path: "edit-product-expenses", component: <DeputyDirectorEditProductExpenses /> },
      { path: "regions", component: <DeputyDirectorRegions /> },
      { path: "add-region", component: <DeputyDirectorAddRegion /> },
      { path: "medical-organizations", component: <DeputyDirectorMedicalOrganizations /> },
      { path: "add-medical-organization", component: <DeputyDirectorAddMedicalOrganization /> },
      { path: "specialities", component: <DeputyDirectorSpecialities /> },
      { path: "add-speciality", component: <DeputyDirectorAddSpeciality /> },
      { path: "add-doctor-plan", component: <DeputyDirectorAddDoctorPlan /> },
      { path: "add-pharmacy-plan", component: <DeputyDirectorAddPharmacyPlan /> },
      { path: "add-product-plan", component: <DeputyDirectorAddProductPlan /> },
      { path: "add-pharmacy", component: <DeputyDirectorAddPharmacy /> },
      { path: "add-doctor", component: <DeputyDirectorAddDoctor /> },
      { path: "mr-info", component: <DeputyDirectorMRInfo /> },
      { path: "update-doctor", component: <DeputyDirectorUpdateDoctor /> },
      { path: "process-reports", component: <DeputyDirectorProcessReports /> },
      { path: "bonus", component: <DeputyDirectorBonusMrs /> },
      { path: "bonus-report", component: <DeputyDirectorBonus /> },
      { path: "bonus-history", component: <DeputyDirectorBonusHistory /> },
      { path: "add-bonus", component: <DeputyDirectorAddBonus /> },
      { path: "doctors", component: <DeputyDirectorDoctors /> },
      { path: "reservations", component: <HeadReservations /> },
      { path: "doctors-data", component: <DeputyDirectorDoctorDatabase /> },
      { path: "debts", component: <DeputyDirectorDebts /> },
      { path: "mrs-monitoring", component: <DeputyDirectorMrsMonitoring /> },
      { path: "login-monitoring", component: <DeputyDirectorLoginMonitoring /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Менеджеры по продукту",
        key: "dd-pms",
        icon: <Icon fontSize="small">manage_accounts</Icon>,
        route: "pms",
      },
      {
        type: "collapse",
        name: "Медицинские представители",
        key: "dd-mrs",
        icon: <Icon fontSize="small">support_agent</Icon>,
        route: "mrs",
      },
      {
        type: "collapse",
        name: "Статистика",
        key: "dd-statistics",
        icon: <Icon fontSize="small">bar_chart</Icon>,
        route: "statistics",
      },
      {
        type: "collapse",
        name: "Регионы",
        key: "dd-regions",
        icon: <Icon fontSize="small">south_america</Icon>,
        route: "regions",
      },
      {
        type: "collapse",
        name: "Производственные компании",
        key: "dd-manufacturer-companies",
        icon: <Icon fontSize="small">business</Icon>,
        route: "manufacturer-companies",
      },
      {
        type: "collapse",
        name: "Медицинские организации",
        key: "dd-medical-organizations",
        icon: <Icon fontSize="small">corporate_fare</Icon>,
        route: "medical-organizations",
      },
      {
        type: "collapse",
        name: "Специальности врачей",
        key: "dd-specialities",
        icon: <Icon fontSize="small">work</Icon>,
        route: "specialities",
      },
      {
        type: "collapse",
        name: "Категории врачей",
        key: "dd-categories",
        icon: <Icon fontSize="small">category</Icon>,
        route: "categories",
      },
      {
        type: "collapse",
        name: "Категории продуктов",
        key: "dd-product-categories",
        icon: <Icon fontSize="small">format_list_bulleted_icon</Icon>,
        route: "product-categories",
      },
      {
        type: "collapse",
        name: "Продукты",
        key: "dd-products",
        icon: <Icon fontSize="small">inventory</Icon>,
        route: "products",
      },
      {
        type: "collapse",
        name: "Список врачей",
        key: "doctors",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "doctors",
      },
      {
        type: "collapse",
        name: "Бонусы",
        key: "dd-bonus",
        icon: <Icon fontSize="small">account_balance_wallet_icon</Icon>,
        route: "bonus",
      },
      {
        type: "collapse",
        name: "Брони",
        key: "dd-reservations",
        icon: <Icon fontSize="small">book_online_icon</Icon>,
        route: "reservations",
      },
      {
        type: "collapse",
        name: "Дебитор",
        key: "dd-debts",
        icon: <Icon fontSize="small">money</Icon>,
        route: "debts",
      },
      {
        type: "collapse",
        name: "База врачей",
        key: "dd-doctors-database",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "doctors-data",
      },
      {
        type: "collapse",
        name: "Процесс отчеты",
        key: "dd-process-reports",
        icon: <Icon fontSize="small">summarize_two_tone_icon</Icon>,
        route: "process-reports",
      },
      {
        type: "collapse",
        name: "Мониторинг",
        key: "dd-mrs-monitoring",
        icon: <Icon fontSize="small">calendar_month</Icon>,
        route: "mrs-monitoring",
      },
    ],
  },
  {
    role: [userRoles.PRODUCT_MANAGER],
    path: "pm",
    routes: [
      { path: "dashboard", component: <ProductManagerDashboard /> },
      // { path: "add", component: <ProductManagerAdd /> },
      { path: "users", component: <DeputyDirectorSinglePM /> },
      { path: "mrs", component: <DeputyDirectorMrs /> },
      { path: "add-notification", component: <DeputyDirectorAddNotification /> },
      { path: "categories", component: <DeputyDirectorCategories /> },
      { path: "add-category", component: <DeputyDirectorAddCategory /> },
      { path: "product-categories", component: <DeputyDirectorProductCategories /> },
      { path: "add-product-category", component: <DeputyDirectorAddProductCategory /> },
      { path: "manufacturer-companies", component: <DeputyDirectorManufacturerCompanies /> },
      { path: "add-manufacturer-company", component: <DeputyDirectorAddManufacturerCompany /> },
      { path: "products", component: <ProductManagerProducts /> },
      { path: "add-product", component: <DeputyDirectorAddProduct /> },
      { path: "regions", component: <DeputyDirectorRegions /> },
      { path: "add-region", component: <DeputyDirectorAddRegion /> },
      { path: "medical-organizations", component: <DeputyDirectorMedicalOrganizations /> },
      { path: "add-medical-organization", component: <DeputyDirectorAddMedicalOrganization /> },
      { path: "specialities", component: <DeputyDirectorSpecialities /> },
      { path: "add-speciality", component: <DeputyDirectorAddSpeciality /> },
      { path: "add-doctor-plan", component: <DeputyDirectorAddDoctorPlan /> },
      { path: "add-pharmacy-plan", component: <DeputyDirectorAddPharmacyPlan /> },
      { path: "add-product-plan", component: <DeputyDirectorAddProductPlan /> },
      { path: "add-pharmacy", component: <DeputyDirectorAddPharmacy /> },
      { path: "add-doctor", component: <DeputyDirectorAddDoctor /> },
      { path: "mr-info", component: <DeputyDirectorMRInfo /> },
      { path: "process-reports", component: <DeputyDirectorProcessReports /> },
      { path: "reservations", component: <HeadReservations /> },
      { path: "bonus", component: <DeputyDirectorBonusMrs /> },
      { path: "bonus-report", component: <DeputyDirectorBonus /> },
      { path: "bonus-history", component: <DeputyDirectorBonusHistory /> },
      { path: "add-bonus", component: <DeputyDirectorAddBonus /> },
      { path: "doctors", component: <DeputyDirectorDoctors /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Мои подопечные",
        key: "pm-users",
        icon: <Icon fontSize="small">person</Icon>,
        route: "users",
      },
      {
        type: "collapse",
        name: "Медицинские представители",
        key: "pm-mrs",
        icon: <Icon fontSize="small">support_agent</Icon>,
        route: "mrs",
      },
      {
        type: "collapse",
        name: "Регионы",
        key: "dd-regions",
        icon: <Icon fontSize="small">south_america</Icon>,
        route: "regions",
      },
      {
        type: "collapse",
        name: "Производственные компании",
        key: "dd-manufacturer-companies",
        icon: <Icon fontSize="small">business</Icon>,
        route: "manufacturer-companies",
      },
      {
        type: "collapse",
        name: "Медицинские организации",
        key: "dd-medical-organizations",
        icon: <Icon fontSize="small">corporate_fare</Icon>,
        route: "medical-organizations",
      },
      {
        type: "collapse",
        name: "Специальности врачей",
        key: "dd-specialities",
        icon: <Icon fontSize="small">work</Icon>,
        route: "specialities",
      },
      {
        type: "collapse",
        name: "Категории врачей",
        key: "dd-categories",
        icon: <Icon fontSize="small">category</Icon>,
        route: "categories",
      },
      {
        type: "collapse",
        name: "Категории продуктов",
        key: "dd-product-categories",
        icon: <Icon fontSize="small">business</Icon>,
        route: "product-categories",
      },
      {
        type: "collapse",
        name: "Продукты",
        key: "dd-products",
        icon: <Icon fontSize="small">inventory</Icon>,
        route: "products",
      },
      {
        type: "collapse",
        name: "Список врачей",
        key: "doctors",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "doctors",
      },
      {
        type: "collapse",
        name: "Бонусы",
        key: "dd-bonus",
        icon: <Icon fontSize="small">account_balance_wallet_icon</Icon>,
        route: "bonus",
      },
      {
        type: "collapse",
        name: "Брони",
        key: "head-reservation",
        icon: <Icon fontSize="small">book_online_icon</Icon>,
        route: "reservations",
      },
      {
        type: "collapse",
        name: "Процесс отчеты",
        key: "dd-process-reports",
        icon: <Icon fontSize="small">summarize_two_tone_icon</Icon>,
        route: "process-reports",
      },
    ],
  },
  {
    role: [userRoles.FIELD_FORCE_MANAGER],
    path: "ff",
    routes: [
      { path: "dashboard", component: <FieldForceManagerDashboard /> },
      { path: "add", component: <FieldForceManagerAdd /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Панель управления",
        key: "dashboard-ff",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Добавить нового пользователя",
        key: "ff-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
    ],
  },
  {
    role: [userRoles.REGIONAL_MANAGER],
    path: "rm",
    routes: [
      { path: "dashboard", component: <RegionalManagerDashboard /> },
      { path: "add", component: <RegionalManagerAdd /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Панель управления",
        key: "dashboard-rm",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Добавить нового пользователя",
        key: "rm-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
      {
        type: "collapse",
        name: "Уведомления",
        key: "rm-notifications",
        icon: <Icon fontSize="small">notifications</Icon>,
        route: "notifications",
      },
    ],
  },
  {
    role: [userRoles.MEDICAL_REPRESENTATIVE],
    path: "mr",
    routes: [{ path: "dashboard", component: <MedicalRepresentativeDashboard /> }],
    sideNav: [
      {
        type: "collapse",
        name: "Панель управления",
        key: "dashboard-mr",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Аптека",
        key: "mr-pharmacy",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "pharmacy",
      },
      {
        type: "collapse",
        name: "Баланс",
        key: "mr-balance",
        icon: <Icon fontSize="small">balance</Icon>,
        route: "balance",
      },
      {
        type: "collapse",
        name: "Врачи",
        key: "mr-doctors",
        icon: <Icon fontSize="small">vaccines</Icon>,
        route: "doctors",
      },
      {
        type: "collapse",
        name: "Оптовая торговля",
        key: "mr-wholesales",
        icon: <Icon fontSize="small">receipt</Icon>,
        route: "wholesales",
      },
    ],
  },
  {
    role: [
      userRoles.HEAD_OF_ORDERS,
      userRoles.WHOLESALE_MANAGER,
      userRoles.DEPUTY_DIRECTOR,
      userRoles.PRODUCT_MANAGER,
    ],
    path: "head",
    routes: [
      { path: "dashboard", component: <HeadOfOrdersDashboard /> },
      { path: "factory-warehouses", component: <HeadOfOrdersFactoryWarehouses /> },
      { path: "add-warehouse-data", component: <HeadofOrdersAddWarehouseData /> },
      { path: "reservations", component: <HeadReservations /> },
      { path: "set-discount", component: <HeadSetDiscount /> },
      { path: "set-invoice-number", component: <HeadSetInvoiceNumber /> },
      { path: "pay-reservation-pharmacy", component: <HeadPayReservationPharmacy /> },
      { path: "pay-reservation-wholesale", component: <HeadPayReservationWholesale /> },
      { path: "pay-reservation-hospital", component: <HeadPayReservationHospital /> },
      { path: "add-reservation", component: <ReservationAdd /> },
      { path: "return-product", component: <HeadReturnProduct /> },

      // Wholesale manager routes
      { path: "companies", component: <WholesaleManagerCompanies /> },
      { path: "add-company", component: <WholesaleManagerAddCompany /> },
      { path: "company-info/:wholesale_id", component: <WholesaleManagerProducts /> },
      { path: "add-produtc/:wholesale_id", component: <WholesaleManagerAddProduct /> },
      { path: "report", component: <WholesaleReports /> },
      { path: "report/:wholesale_id", component: <WholesaleReportDetails /> },
      { path: "add-sale", component: <WholesaleAddSale /> },
      { path: "add-pharmacy", component: <WholesaleAddPharmacy /> },
      { path: "product-report", component: <WholesaleProductDetails /> },
      { path: "add-balance-in-stock", component: <WholesaleAddBalanceInStock /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Производственные компании",
        key: "head-factory-warehouses",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "factory-warehouses",
      },
      {
        type: "collapse",
        name: "Брони",
        key: "head-reservation",
        icon: <Icon fontSize="small">book_online_icon</Icon>,
        route: "reservations",
      },
      {
        type: "collapse",
        name: "Оптовые компании",
        key: "companies",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "companies",
      },
      {
        type: "collapse",
        name: "Отчеты",
        key: "ws-reports",
        icon: <Icon fontSize="small">summarize_icon</Icon>,
        route: "report",
      },
    ],
  },
  {
    role: [userRoles.WHOLESALE_MANAGER, userRoles.HEAD_OF_ORDERS],
    path: "ws",
    routes: [
      { path: "dashboard", component: <WholesaleManagerDashboard /> },
      { path: "companies", component: <WholesaleManagerCompanies /> },
      { path: "add-company", component: <WholesaleManagerAddCompany /> },
      { path: "company-info/:wholesale_id", component: <WholesaleManagerProducts /> },
      { path: "add-produtc/:wholesale_id", component: <WholesaleManagerAddProduct /> },
      { path: "add-reservation/:wholesale_id", component: <WholesaleManagerAddReservation /> },
      { path: "report", component: <WholesaleReports /> },
      { path: "report/:wholesale_id", component: <WholesaleReportDetails /> },
      { path: "add-sale", component: <WholesaleAddSale /> },
      { path: "add-pharmacy", component: <WholesaleAddPharmacy /> },
      { path: "product-report", component: <WholesaleProductDetails /> },
      { path: "add-balance-in-stock", component: <WholesaleAddBalanceInStock /> },
      // Head of orders routes
      { path: "factory-warehouses", component: <HeadOfOrdersFactoryWarehouses /> },
      { path: "add-warehouse-data", component: <HeadofOrdersAddWarehouseData /> },
      { path: "reservations", component: <HeadReservations /> },
      { path: "set-discount", component: <HeadSetDiscount /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Оптовые компании",
        key: "companies",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "companies",
      },
      {
        type: "collapse",
        name: "Отчеты",
        key: "ws-reports",
        icon: <Icon fontSize="small">summarize_icon</Icon>,
        route: "report",
      },
      {
        type: "collapse",
        name: "Производственные компании",
        key: "head-factory-warehouses",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "factory-warehouses",
      },
      {
        type: "collapse",
        name: "Брони",
        key: "head-reservation",
        icon: <Icon fontSize="small">book_online_icon</Icon>,
        route: "reservations",
      },
    ],
  },
];

export default roleBasedRoutes;
