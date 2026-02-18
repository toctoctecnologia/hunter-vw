import { LucideIcon } from 'lucide-react';
import { SelectedItem } from '../components/modal/catcher-list-modal';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  description?: string;
  permissionCode: string[];
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

interface LeadBankItem {
  uuid: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type RegisterFormType = 'TIPO' | 'PLANO' | 'DADOS' | 'EMPRESA' | 'ADMIN' | 'RESUMO' | 'ADDRESS';

enum PropertyFeatureType {
  EXTRA = 'EXTRA',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  LEISURE = 'LEISURE',
}

enum CondominiumFeatureType {
  EXTRA = 'EXTRA',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  LEISURE = 'LEISURE',
}

interface RegisterStepItem {
  type: RegisterFormType;
  title: string;
  description: string;
  summary: string;
}

type SignatureInfoStatus =
  | 'ACTIVE'
  | 'WAITING_PAYMENT_CONFIRMATION'
  | 'WAITING_RELEASE'
  | 'OVERDUE'
  | 'TEST_PERIOD_ACTIVE'
  | 'EXPIRED';

interface UserInformation {
  userInfo: {
    uuid: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    isSuperAdmin: boolean;
    showRoulettePopup: boolean;
    profile: {
      code: string;
      name: string;
      description: string;
      permissions: { code: string; name: string; description: string }[];
    };
  };
  signatureInfo: {
    status: SignatureInfoStatus;
    lastExpirationDate: string;
  };
  signUpCompleted: boolean;
}

interface Plan {
  uuid: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  tier: number;
  activeUsersAmount: number;
  activePropertiesAmount: number;
}

interface Permission {
  code: string;
  name: string;
  description: string;
  tier: number;
  groupName: string;
}

interface Client {
  id: string;
  accountType: string;
  name: string;
  email: string;
  phone: string;
  companyInfo: {
    socialReason: string;
    federalDocument: string;
    stateRegistration: string;
    municipalRegistration: string;
    unitAmount: number;
    website: string;
  };
  personalInfo: {
    federalDocument: string;
    city: string;
    creci: string;
  };
  signature: {
    status: string;
    plan: {
      name: string;
      uuid: string;
      description: string;
      monthlySignaturePrice: number;
      annualSignaturePrice: number;
      tier: number;
      activeUsersAmount: number;
      activePropertiesAmount: number;
    };
    signaturePrice: number;
    expirationDate: string;
  };
  createdAt: string;
  updatedAt: string;
  activeUsersAmount: number;
  activePropertiesAmount: number;
}

interface PropertyFeature {
  uuid: string;
  name: string;
  description: string;
  type: PropertyFeatureType;
}

interface CondominiumFeature {
  uuid: string;
  name: string;
  description: string;
  type: CondominiumFeatureType;
}

interface PropertySecondaryDistrict {
  uuid: string;
  name: string;
}

interface PropertyBuilder {
  uuid: string;
  name: string;
  yearsOfExperience: string;
}

interface PropertyKeychainItem {
  id: number;
  uuid: string;
  status: PropertyKeychainStatus;
  unit: string;
  board: string;
  boardPosition: string;
  sealNumber: string;
  keyQuantity: number;
  observation: string;
  createdAt: string;
  updatedAt: string;
}

interface PropertyCatcherAssignmentItem {
  uuid: string;
  catcherUuid: string;
  catcherName: string;
  catcherEmail: string;
  percentage: number;
  referredBy?: string;
  isMain: boolean;
}

interface PropertyOwnerAssignmentItem {
  id: number;
  uuid: string;
  name: string;
  phone: string;
  cpfCnpj: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

interface ArchiveReason {
  uuid: string;
  reason: string;
}

interface TeamDetail {
  uuid: string;
  name: string;
  isActive: boolean;
  branch: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
}

interface UnitDetail {
  uuid: string;
  socialReason: string;
  federalDocument: string;
  stateRegistration: string;
  municipalRegistration: string;
  website: string;
}

interface PropertyGeneralMetrics {
  captationPropertiesCount: number;
  percentageOfCaptationProperties: number;
  volumnCaptationValue: number;
  volumnCaptationValuePercentage: number;
  activePropertiesCount: number;
  percentageOfActiveProperties: number;
}

interface TeamMember {
  uuid: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface Record<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

enum PropertyType {
  CASA = 'CASA',
  CASA_EM_CONDOMINIO = 'CASA_EM_CONDOMINIO',
  TERRENO_EM_CONDOMINIO = 'TERRENO_EM_CONDOMINIO',
  TERRENO = 'TERRENO',
  APARTAMENTO = 'APARTAMENTO',
  APARTAMENTO_DIFERENCIADO = 'APARTAMENTO_DIFERENCIADO',
  COBERTURA = 'COBERTURA',
  PREDIO_INTEIRO = 'PREDIO_INTEIRO',
  LOFT_STUDIO_KITNET = 'LOFT_STUDIO_KITNET',
}

enum PropertySignStatus {
  SOLICITADA = 'SOLICITADA',
  INSTALADA = 'INSTALADA',
  RETIRADA = 'RETIRADA',
}

enum PropertyStatus {
  DISPONIVEL_NO_SITE = 'DISPONIVEL_NO_SITE',
  DISPONIVEL_INTERNO = 'DISPONIVEL_INTERNO',
  INDISPONIVEL = 'INDISPONIVEL',
  EM_CAPTACAO = 'EM_CAPTACAO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  VENDIDO = 'VENDIDO',
  PUBLICADO = 'PUBLICADO',
  EM_NEGOCIACAO = 'EM_NEGOCIACAO',
  RESERVADO = 'RESERVADO',
  RETIRADO = 'RETIRADO',
  PENDING_TO_APPROVE = 'PENDING_TO_APPROVE',
  ARQUIVADO = 'ARQUIVADO',
  ALUGADO = 'ALUGADO',
}

enum PlanNames {
  AUTONOMOUS = 'AUTONOMOUS',
  START = 'START',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

enum PropertyKeychainStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  MANUTENCAO = 'MANUTENCAO',
}

enum IntegrationType {
  IMOVIEW = 'IMOVIEW',
  CHAVES_NA_MAO = 'CHAVES_NA_MAO',
  DWV = 'DWV',
  ROCKET_MOBI = 'ROCKET_MOBI',
}

enum IntegrationJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  IN_QUEUE = 'IN_QUEUE',
  COMPLETED_WITH_ERROR = 'COMPLETED_WITH_ERROR',
}

enum LeadOriginType {
  WHATSAPP = 'WHATSAPP',
  TELEFONE = 'TELEFONE',
  REDE_SOCIAL = 'REDE_SOCIAL',
  SHOWROOM = 'SHOWROOM',
  EMAIL_MARKETING = 'EMAIL_MARKETING',
  VIVA_REAL = 'VIVA_REAL',
  VIVA_REAL_LANCAMENTO = 'VIVA_REAL_LANCAMENTO',
  ZAP_IMOVEIS_GRUPO_ZAP = 'ZAP_IMOVEIS_GRUPO_ZAP',
  IMOVELWEB = 'IMOVELWEB',
  OLX = 'OLX',
  CHAVES_NA_MAO = 'CHAVES_NA_MAO',
  VITRINE = 'VITRINE',
  SITE = 'SITE',
  SITE_PROPRIO = 'SITE_PROPRIO',
  SITE_PROPRIO_ROCKETIMOB = 'SITE_PROPRIO_ROCKETIMOB',
  LANDING_PAGE = 'LANDING_PAGE',
  RD_STATION_API = 'RD_STATION_API',
  API = 'API',
  TYPEBOT = 'TYPEBOT',
  C2SBOT = 'C2SBOT',
  LEADSTER = 'LEADSTER',
  INDICACAO = 'INDICACAO',
  RELACIONAMENTO = 'RELACIONAMENTO',
  RELACIONAMENTO_AMIGO_PARENTE = 'RELACIONAMENTO_AMIGO_PARENTE',
  CLIENTE_DE_CARTEIRA = 'CLIENTE_DE_CARTEIRA',
  LISTA_EXTERNA_DE_CLIENTES = 'LISTA_EXTERNA_DE_CLIENTES',
  IMPORTADOS_DA_PLANILHA = 'IMPORTADOS_DA_PLANILHA',
  MIDIAS_PARTICULARES = 'MIDIAS_PARTICULARES',
  PARCERIA_COM_OUTRA_IMOBILIARIA = 'PARCERIA_COM_OUTRA_IMOBILIARIA',
  PLACA_TELEFONE_WHATS = 'PLACA_TELEFONE_WHATS',
}

enum LeadIntensityType {
  QUENTE = 'QUENTE',
  MORNO = 'MORNO',
  FRIO = 'FRIO',
  MUITO_FRIO = 'MUITO_FRIO',
}

enum DistributionCheckinEventType {
  CHECKIN = 'CHECKIN',
  CHECKOUT = 'CHECKOUT',
}

enum LeadNegotiationType {
  COMPRA = 'COMPRA',
  ALUGUEL = 'ALUGUEL',
  LANCAMENTO = 'LANCAMENTO',
  CAPTACAO = 'CAPTACAO',
  INDEFINIDO = 'INDEFINIDO',
}

enum LeadStatusType {
  ATIVO = 'ATIVO',
  ARQUIVADO = 'ARQUIVADO',
}

enum CommissionAgentType {
  REALTOR = 'REALTOR',
  MANAGER = 'MANAGER',
  PARTNER = 'PARTNER',
  CATCHER = 'CATCHER',
}

enum LeadQualification {
  RECENT = 'RECENT',
  ATTENTION = 'ATTENTION',
  URGENT = 'URGENT',
}

enum PropertyQualification {
  RECENT = 'RECENT',
  ATTENTION = 'ATTENTION',
  URGENT = 'URGENT',
}

enum LeadFunnelStages {
  PRE_ATENDIMENTO = 'PRE_ATENDIMENTO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  AGENDAMENTO = 'AGENDAMENTO',
  VISITA = 'VISITA',
  PROPOSTA_ENVIADA = 'PROPOSTA_ENVIADA',
  EM_NEGOCIACAO = 'EM_NEGOCIACAO',
  NEGOCIO_FECHADO = 'NEGOCIO_FECHADO',
  INDICACAO = 'INDICACAO',
  RECEITA_GERADA = 'RECEITA_GERADA',
  POS_VENDA = 'POS_VENDA',
}

enum PaymentPeriodType {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

enum PaymentBillingType {
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}

enum PropertyMediaFeature {
  PROPERTY = 'PROPERTY',
  LEISURE = 'LEISURE',
  VIDEO = 'VIDEO',
  CONSTRUCTION = 'CONSTRUCTION',
}

enum PlanStatus {
  PENDING = 'PENDING',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

enum FurnishedStatus {
  MOBILIADO = 'MOBILIADO',
  VAZIO = 'VAZIO',
}

enum LeadProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

enum PropertySituation {
  VAGO_DISPONIVEL = 'VAGO_DISPONIVEL',
  EM_REFORMA = 'EM_REFORMA',
  OCUPADO = 'OCUPADO',
}

enum PropertyDestination {
  RESIDENCIAL = 'RESIDENCIAL',
  COMERCIAL = 'COMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  RURAL = 'RURAL',
}

enum PropertySecondaryType {
  DUPLEX = 'DUPLEX',
  TRIPLEX = 'TRIPLEX',
  GARDEN = 'GARDEN',
  PENTHOUSE = 'PENTHOUSE',
}

enum PropertyPurpose {
  VENDA = 'VENDA',
  ALUGUEL = 'ALUGUEL',
  TEMPORADA = 'TEMPORADA',
  VENDA_ALUGUEL = 'VENDA_ALUGUEL',
}

enum PropertyGarageType {
  SEM_VAGA = 'SEM_VAGA',
  SIMPLES = 'SIMPLES',
  DUPLA = 'DUPLA',
  COBERTA = 'COBERTA',
  DESCOBERTA = 'DESCOBERTA',
  BOX = 'BOX',
  VAGA_ROTATIVA = 'VAGA_ROTATIVA',
  VAGA_TRANCADA = 'VAGA_TRANCADA',
  OUTRO = 'OUTRO',
}

enum LeadCreditApprovalStatus {
  NOT_SENT = 'NOT_SENT',
  IN_ANALYSIS = 'IN_ANALYSIS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

enum LeadPaymentConditionTypes {
  OWN_RESOURCES = 'OWN_RESOURCES',
  FINANCING = 'FINANCING',
  CONSORTIUM = 'CONSORTIUM',
  EXCHANGE = 'EXCHANGE',
  OTHER = 'OTHER',
}

enum OverlaySettingPosition {
  TOP_LEFT = 'TOP_LEFT',
  TOP_CENTER = 'TOP_CENTER',
  TOP_RIGHT = 'TOP_RIGHT',
  MIDDLE_LEFT = 'MIDDLE_LEFT',
  MIDDLE = 'MIDDLE',
  MIDDLE_RIGHT = 'MIDDLE_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

enum LeadPaymentExchangeType {
  PROPERTY = 'PROPERTY',
  VEHICLE = 'VEHICLE',
  OTHER = 'OTHER',
}

enum QueueRuleOperationTypes {
  CONTAINS = 'CONTAINS',
  EQUALS = 'EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
}

enum LeadPaymentPriceIndex {
  INCC = 'INCC',
  IPCA = 'IPCA',
  IGPM = 'IGPM',
  NO_INDEX = 'NO_INDEX',
}

enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

enum PropertyReadinessStatus {
  NA_PLANTA = 'NA_PLANTA',
  PRONTO_PARA_MORAR = 'PRONTO_PARA_MORAR',
}

enum PropertyConstructionStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  LAUNCH = 'LAUNCH',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  FINISHING = 'FINISHING',
  READY = 'READY',
}

enum PropertyLaunchType {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
  LOTS = 'LOTS',
}

enum PropertyPositionType {
  FRONT = 'FRONT',
  BACK = 'BACK',
  SIDE = 'SIDE',
  MIDDLE = 'MIDDLE',
}

enum FunnelDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

enum PropertyNoteType {
  OK = 'OK',
  ATENCAO = 'ATENCAO',
  CRITICO = 'CRITICO',
  INFO = 'INFO',
}

enum CouponListType {
  SINGLE_USE = 'SINGLE_USE',
  DATE_EXPIRATION = 'DATE_EXPIRATION',
}

enum DistributionReportStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

enum NotificationTargetType {
  APPOINTMENT = 'APPOINTMENT',
  TASK = 'TASK',
  LEAD = 'LEAD',
}

enum SaleActionDetailParticipantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

enum WhatsappSessionStatus {
  NOT_FOUND = 'NOT_FOUND',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
}

enum CaptationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

enum NotificationType {
  REMINDER = 'REMINDER',
  SUGGESTION = 'SUGGESTION',
}

enum NotificationFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

enum RedistributionBatchJobItemStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

enum QueueRuleNames {
  LEAD_CITY = 'LEAD_CITY',
  LEAD_KEYWORD = 'LEAD_KEYWORD',
  LEAD_LIMIT_TYPE = 'LEAD_LIMIT_TYPE',
  LEAD_NEGOTIATION_TYPE = 'LEAD_NEGOTIATION_TYPE',
  LEAD_NEIGHBORHOOD = 'LEAD_NEIGHBORHOOD',
  LEAD_ORIGIN_TYPE = 'LEAD_ORIGIN_TYPE',
  LEAD_PRODUCT_PRICE = 'LEAD_PRODUCT_PRICE',
  LEAD_PROPERTY_CODE = 'LEAD_PROPERTY_CODE',
  LEAD_TAG = 'LEAD_TAG',
  LEAD_TEAM_CATCHER = 'LEAD_TEAM_CATCHER',
  LEAD_TITLE_TYPE = 'LEAD_TITLE_TYPE',
  LEAD_USER_CATCHER = 'LEAD_USER_CATCHER',
  MEMORY_DAYS = 'MEMORY_DAYS',
}

enum WeekDays {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

enum GlobalSearchTypes {
  PROPERTY = 'PROPERTY',
  LEAD = 'LEAD',
  CONDOMINIUM = 'CONDOMINIUM',
  TASK = 'TASK',
  APPOINTMENT = 'APPOINTMENT',
  PROPERTY_BUILDER = 'PROPERTY_BUILDER',
}

interface PropertyMedia {
  mediaFeature: string;
  mediaType: string;
  principalMedia: boolean;
  url: string;
  description: string;
  order: number;
}

interface CreditAnalyseDocument {
  status: string;
  mediaType: string;
  fileName: string;
}

interface AuditEvent {
  eventId: string;
  eventType: string;
  accountId: number;
  userUuid: string;
  username: string;
  userEmail: string;
  profileName: string;
  action: string;
  metadata: null;
  entityReferences: null;
  ipAddress: string;
  occurredAt: string;
  description: string | null;
}

interface PropertyDimensions {
  internalArea: number;
  externalArea: number;
  lotArea: number;
}

interface PropertyDetail {
  uuid: string;
  name: string;
  code: string;
  description: string;
  principalPictureUrl: string;
  statusJustification: string;
  ownerName: string;
  ownerPhone: string;
  price: number;
  previousPrice: number;
  iptuValue: number;
  commission: number;
  status: PropertyStatus;
  updatedAt: string;
  location: {
    street: string;
    number: string;
    city: string;
    state: string;
    floor: string;
    unit: string;
    zipCode: string;
    secondaryDistrict: { uuid: string; name: string };
    district: string;
  };
  dimension: PropertyDimensions;
  featureSummary: {
    area: number;
    rooms: number;
    suites: number;
    bathrooms: number;
    garageSpots: number;
    keyLocation: string;
    livingRooms: number;
    balconies: number;
    floorFinish: string;
    propertyPosition: string;
    features: { uuid: string; name: string; description: string }[];
    condominium: { uuid: string; name: string };
    furnishedStatus: FurnishedStatus;
  };
  payment: { paymentMethods: string; directWithOwner: boolean; acceptsFinancing: boolean };
  builder: { name: string; yearsOfExperience: number };
  info: {
    isHighlighted: boolean;
    isAvailable: boolean;
    isAvailableForRent: boolean;
    access: string;
    lastContact: string; // '2025-11-04T23:53:59.065Z'
    propertyType: string;
    situation: PropertySituation;
    destination: PropertyDestination;
    purpose: PropertyPurpose;
    garageType: PropertyGarageType;
    propertySituation: string;
    propertyDestination: string;
    secondaryType: PropertySecondaryType;
    propertyPurpose: string;
    propertyReadinessStatus: string;
    readinessStatus: PropertyReadinessStatus;
    keysAmount: number;
    garageLocation: string;
    adTitle: string;
    adDescription: string;
    metaDescription: string;
    elevatorsCount: number;
    towersCount: number;
    floorsCount: number;
    unitsPerFloor: number;
    totalUnits: number;
    signAuthorized: boolean;
    signStatus: PropertySignStatus;
    signDetails: string;
  };
  catchers: { uuid: string; name: string; email: string; phone: string }[];
  notes: { catcherUuid: string; noteType: string; description: string }[];
}

interface CatcherItem {
  uuid: string;
  name: string;
}

interface CondominiumDetail {
  uuid: string;
  name: string;
  price: number;
  edificeName: string;
  years: number;
  builder: PropertyBuilder;
  principalPictureUrl: string;
  createdAt: string;
  updatedAt: string;
  featureUuids: string[];
}

interface UserProfileMetrics {
  soldPropertiesAmount: number;
  activeLeads: number;
}

interface PropertyFullFormData {
  uuid: string;
  name: string;
  description: string;
  price: number;
  previousPrice: number;
  iptuValue: number;
  commission: number;
  status: PropertyStatus;
  secondaryDistrictUuid: string;
  condominiumUuid: string;
  builderUuid: string;
  location: {
    street: string;
    number: string;
    city: string;
    floor: string;
    state: string;
    unit: string;
    zipCode: string;
  };
  dimension: PropertyDimensions;
  feature: {
    area: number;
    rooms: number;
    suites: number;
    bathrooms: number;
    garageSpots: number;
    keyLocation: string;
    furnishedStatus: FurnishedStatus;
  };
  payment: {
    paymentMethods: string;
    directWithOwner: boolean;
    acceptsFinancing: boolean;
  };
  info: {
    isHighlighted: boolean;
    isAvailable: boolean;
    isAvailableForRent: boolean;
    access: string;
    lastContact: string; // '2025-11-05T15:01:18.053Z'
    propertyType: PropertyType;
    situation: PropertySituation;
    destination: PropertyDestination;
    secondaryType: PropertySecondaryType;
    purpose: PropertyPurpose;
    keysAmount: number;
    garageType: PropertyGarageType;
    garageLocation: string;
    adTitle: string;
    adDescription: string;
    metaDescription: string;
    readinessStatus: PropertyReadinessStatus;
    ownerName: string;
    ownerPhone: string;
  };
  featureUuids: string[];
  catcherUuids: string[];
  notes: { noteType: PropertyNoteType; description: string }[];
}

interface LeadDetail {
  uuid: string;
  propertyCode: string | null;
  catcher: { uuid: string; name: string; email: string; phone: string };
  canModifyQueue: boolean;
  canJoinRoletao: boolean;
  status: string;
  name: string;
  phone1: string;
  phone2: string | null;
  email: string;
  intensityType: LeadIntensityType;
  productTitle: string;
  productPrice: number | null;
  qualification: LeadQualification;
  negotiationType: LeadNegotiationType;
  isAccessorEnabled: boolean;
  adUrl: string;
  originType: LeadOriginType;
  messageToCatcher: string | null;
  contactOriginType: string;
  funnelStep: LeadFunnelStages;
  archivedBy: string | null;
  archivedReason: string | null;
  archivedType: string | null;
  firstContactedAt: string;
  lastContactedAt: string;
  conversationSummary: string | null;
  createdAt: string;
  expiresIn: number;
}

interface RoulleteSettings {
  timeLimitMinutes: number;
  startTime: string;
  endTime: string;
  availableDays: WeekDays[];
  onlyQueueUsersDistribution: boolean;
  isActive: boolean;
}

interface RoulleteNextQueueSettings {
  nextUserEnabled: boolean;
  timeLimitMinutes: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

interface RoulleteNextQueueUserItem {
  userUuid: string;
  userName: string;
  userEmail: string;
  userOrder: number;
  isActive: boolean;
  offersReceived: number;
  distributions: number;
  lastOfferUpdate: string;
  isNextToReceive: boolean;
}

interface RoulleteLastOfferItem {
  id: number;
  leadName: string;
  leadPhone: string;
  leadOrigin: string;
  catcherName: string;
  terminatedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreditAnalyseItem {
  uuid: string;
  creditApprovalStatus: LeadCreditApprovalStatus;
  declaredInvoice: number;
}

interface LeadAdditionalInfoItem {
  uuid: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

interface LeadQualificationTimesItem {
  updatedAt: string;
  urgentMinDays: number;
  attentionMaxDays: number;
  attentionMinDays: number;
  recentMaxDays: number;
}

interface PropertyQualificationTimesItem {
  updatedAt: string;
  urgentMinDays: number;
  attentionMaxDays: number;
  attentionMinDays: number;
  recentMaxDays: number;
}

interface RoulleteRankingUserItem {
  userUuid: string;
  userName: string;
  userEmail: string;
  catchCount: number;
}

interface RoulleteRankingData {
  topCatchers: RoulleteRankingUserItem[];
  bottomCatchers: RoulleteRankingUserItem[];
}

interface PropertyPreferenceHistoryItem {
  uuid: string;
  area: number;
  rooms: number;
  bathrooms: number;
  garageSpots: number;
  suites: number;
  internalArea: number;
  externalArea: number;
  lotArea: number;
  propertyValue: number;
  propertyType: PropertyType;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadUpdateItem {
  uuid: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

interface LeadImportJobItem {
  jobId: string;
  status: string;
  fileName: string;
  totalRecords: number;
  processedRecords: number;
  errorCount: number;
  errorMessage: string;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
}

interface LeadPropertyItem {
  uuid: string;
  name: string;
  code: string;
  principalMediaUrl: string;
  price: number;
}

interface LeadManageConversionMetrics {
  originType: LeadOriginType;
  conversionRate: number;
  totalLeads: number;
  convertedLeads: number;
}

interface LeadManagePerformanceMetrics {
  conversionRate: number;
  averageTimeToClose: number;
  firstInteractionTime: number;
}

interface LeadQualificationTimeMetrics {
  leadQualification: LeadQualification;
  totalLeads: number;
  leadPercentage: number;
}

interface PropertyQualificationUpdateMetrics {
  propertyQualification: PropertyQualification;
  totalProperties: number;
  propertyPercentage: number;
}

interface LeadProposalItem {
  uuid: string;
  propertyCode: string;
  status: LeadProposalStatus;
  proposalTotalValue: number;
  validity: string;
  paymentConditionTypes: LeadPaymentConditionTypes[];
  ownResources: {
    uuid: string;
    resourcesAmount: number;
    balance: number;
  } | null;
  financing: {
    uuid: string;
    bankName: string;
    financingPercent: number;
    signalValue: number;
    term: number;
    taxRate: number;
    fgtsValue: number;
  } | null;
  consortium: {
    uuid: string;
    value: number;
    consortiumContemplated: boolean;
  } | null;
  exchange: {
    uuid: string;
    exchangeType: LeadPaymentExchangeType;
    exchangeValue: number;
    observations: string;
  };
  otherPayment: {
    uuid: string;
    description: string;
    amount: number;
  };
  signal: {
    uuid: string;
    signalValue: number;
    signalDate: string; // 'YYYY-MM-DD';
    priceIndex: LeadPaymentPriceIndex;
    observations: string;
  };
}

interface LeadClosedDealItem {
  uuid: string;
  propertyCode: string;
  closedDate: string;
  totalValue: number;
  totalCommission: number;
  negotiationType: LeadNegotiationType;
  additionalInfo: string;
  createdAt: string;
  revenueGenerationDate: string;
  commissions: [
    {
      agentUuid: string;
      agentType: CommissionAgentType;
      agentName: string;
      agentEmail: string;
      federalDocument: string;
      commissionPercentage: number;
      mainResponsible: boolean;
    },
  ];
}

interface LeadFunnelItem {
  funnelStep: LeadFunnelStages;
  leadsAmount: number;
  percentageOfTotal: number;
  targetPercentage: number;
}

interface PropertyMetricTopPropertyStatusesItem {
  status: PropertyStatus;
  count: number;
  totalValue: number;
  percentage: number;
}

interface PropertyMetricCaptationStatusSummaryItem {
  status: string;
  count: number;
  percentage: number;
}

interface PropertyMetricCaptationSummaryItem {
  year: number;
  month: number;
  captatedCount: number;
  soldCount: number;
}

interface PropertyMetricsItem {
  newPropertiesCount: number;
  exitedPropertiesCount: number;
  averagePrice: number;
  topPropertyStatuses: PropertyMetricTopPropertyStatusesItem[];
  captationStatusSummary: PropertyMetricCaptationStatusSummaryItem[];
  monthlyCaptationSummary: PropertyMetricCaptationSummaryItem[];
  availablePropertiesCount: number;
}

interface PropertyVisiting {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface WhatsappSessionStatusItem {
  historySessionToken: string | null;
  status: WhatsappSessionStatus;
  phoneNumber: string;
  email: string;
  validationToken: number;
}

interface OverlaySetting {
  id: number;
  watermarkImagePath: string;
  position: OverlaySettingPosition;
  opacity: number;
  scale: number;
  margin: number;
  active: boolean;
}

interface UserLeadQualificationMetricItem {
  leadQualification: LeadQualification;
  totalLeads: number;
  leadPercentage: number;
}

interface UserPropertyQualificationMetricItem {
  propertyQualification: PropertyQualification;
  totalProperties: number;
  propertyPercentage: number;
}

interface DeactivateUserMetricsData {
  leadsTotalAmount: number;
  leadsCountByIntensity: {
    QUENTE?: number;
    MORNO?: number;
    FRIO?: number;
    MUITO_FRIO?: number;
  };
}

interface KanbanColumn {
  id: string;
  title: string;
  leads: LeadDetail[];
  isCustom?: boolean;
}

interface KanbanBoard {
  columns: KanbanColumn[];
}

interface PropertyFilters {
  filter: string;
  status: PropertyStatus | null;
  qualificationType: PropertyQualification | null;
  featureUuids: string[];
  catcherUuids?: string;
  area: string;
  rooms: string;
  bathrooms: string;
  garageSpots: string;
  suites: string;
  internalArea: string;
  externalArea: string;
  lotArea: string;
  garageType?: PropertyGarageType;
  propertyType?: PropertyType;
  propertyValue: string;
  keyLocations?: string;
  isHighlighted?: boolean;
  isAvailable?: boolean;
  isAvailableForRent?: boolean;
  acceptsPermuta?: boolean;
  displayedOnPortal?: boolean;
  internetPublication?: boolean;
  situation?: PropertySituation;
  destination?: PropertyDestination;
  region?: string;
  subRegion?: string;
  usageZone?: string;
  constructionStatus?: PropertyConstructionStatus;
  launchType?: PropertyLaunchType;
  propertyPositionType?: PropertyPositionType;
  registrationStartDate?: string;
  registrationEndDate?: string;
}

interface NegotiationFilters {
  qualification?: LeadQualification;
  afterDistribution?: boolean;
  funnelStep?: LeadFunnelStages;
  status?: LeadStatusType;
  origin?: LeadOriginType;
  negotiationType?: LeadNegotiationType;
  intensityType?: LeadIntensityType;
  lastContactedAtFrom?: string;
  lastContactedAtTo?: string;
  teamUuid?: string;
  contactOriginType?: FunnelDirection;
  startDate?: string;
  endDate?: string;
  preferences?: {
    area?: number;
    rooms?: number;
    bathrooms?: number;
    garageSpots?: number;
    suites?: number;
    internalArea?: number;
    externalArea?: number;
    lotArea?: number;
    propertyValue?: number;
    propertyType?: string;
    city?: string;
    state?: string;
    neighborhood?: string;
  };
}

interface LeadsDashboardFilters {
  month: number;
  year: number;
  teamUuid?: string;
  funnelType?: string;
  campaignUuid?: string;
  propertyPurpose?: PropertyPurpose;
  funnelStepId?: string;
  intensityType?: LeadIntensityType;
  originType?: LeadOriginType;
  catcherId?: string;
}

interface FunnelByWeekItem {
  weekNumber: number;
  attendances: number;
  visits: number;
  proposals: number;
  deals: number;
  discards: number;
}

interface VisitsWithoutFollowUpItem {
  propertyName: string;
  count: 0;
  leadUuid: string;
  leadName: string;
}

interface SixWeekSalesFunnelItem {
  weekNumber: number;
  attendances: number;
  visits: number;
  proposals: number;
  deals: number;
  discards: number;
}

interface TopPropertiesItem {
  propertyName: string;
  propertyCode: number;
  leadsCount: number;
  scheduledVisits: number;
  proposalsSent: number;
  salesMade: number;
  averageTicket: number;
}

interface AttendanceType {
  type: LeadOriginType;
  count: number;
}

interface LeadsDashboardThermometerItem {
  intensityType: LeadIntensityType;
  count: number;
}

interface ArchivedByChannelItem {
  originType: LeadOriginType;
  count: number;
  percentage: number;
}

interface ArchivedByReasonItem {
  reasonUuid: string;
  reason: string;
  count: number;
  percentage: number;
}

interface LeadByItem {
  label: string;
  count: number;
}

interface LeadsDashboardItem {
  salesFunnelByWeek: FunnelByWeekItem[];
  activeAttendances: { count: number };
  visitsWithoutFollowUp: VisitsWithoutFollowUpItem[];
  sixWeekSalesFunnel: SixWeekSalesFunnelItem[];
  attendanceType: AttendanceType[];
  thermometer: LeadsDashboardThermometerItem[];
  leadsReceivedBySource: LeadByItem[];
  leadsReceivedBySeller: LeadByItem[];
  leadsReceivedByDayOfWeek: LeadByItem[];
  topProperties: TopPropertiesItem[];
}

interface PropertiesReportFilters {
  search?: string;
  status?: PropertyStatus;
  team?: string;
  startDate?: string;
  endDate?: string;
}

interface PropertyReportData {
  code: number;
  name: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  interestedLeads: { uuid: string; name: string; phone1: string; phone2: string | null }[];
  interested: number;
  scheduledVisits: number;
  completedVisits: number;
  proposals: number;
  deals: number;
  updatedAt: string;
}

interface PropertyReportSummaryData {
  visits: number;
  activeProperties: number;
  publishedProperties: number;
  interested: number;
  proposals: number;
  deals: number;
}

interface LeadsReportFilters {
  search?: string;
  status?: LeadFunnelStages;
  team?: string;
  startDate?: string;
  endDate?: string;
}

interface LeadsReportData {
  id: string;
  name: string;
  phone1: string;
  email: string;
  originType: string;
  catcherName: string;
  teamName: string;
  funnelStep: LeadFunnelStages;
  createdAt: string;
  updatedAt: string;
  lastContactedAt: string;
  productPrice: number | null;
}

interface LeadsReportSummaryData {
  totalLeads: number;
  activeLeads: number;
  archivedLeads: number;
  leadsByFunnelStep: number;
  leadsByOrigin: number;
  leadsWithValidContact: number;
  leadsWithProductPrice: number;
  leadsContactedInPeriod: number;
}

interface QueueItemDetailUser {
  userUuid: string;
  userName: string;
  isActive: boolean;
  userOrder: number;
  observation?: string;
  openedLeadsLimit?: number;
}

interface QueueItemDetail {
  name: string;
  color: string;
  checkinConfig: {
    startingTime: string;
    endingTime: string;
    daysOfWeek: string;
    checkInRequired?: boolean;
    timeWindowEnabled?: boolean;
    qrCodeEnabled?: boolean;
  };
  rules: {
    ruleUuid: string;
    value: string;
    operation: QueueRuleOperationTypes;
  }[];
  users: QueueItemDetailUser[];
  description?: string;
  isActive?: boolean;
  nextUserEnabled?: boolean;
  timeLimitMinutes?: number;
}

interface CatchersReportFilters {
  search?: string;
  isActive: string;
  team?: string;
}

interface QueueFilters {
  search?: string;
  isActive: string;
}

interface CatcherReportData {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
}

interface ScheduleReportFilters {
  search?: string;
  isCompleted: string;
  lead?: string;
  team?: string;
  startDate?: string;
  endDate?: string;
}

interface ScheduleReportData {
  id: number;
  title: string;
  date: string;
  clientName: string;
  isCompleted: boolean;
}

interface ExportHistoryData {
  id: string;
  reportType: string;
  format: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  filePath: string;
}

interface QueueItem {
  uuid: string;
  name: string;
  description: string;
  isActive: boolean;
  queueOrder: number;
  nextUserEnabled: boolean;
  color: string;
  activeUsersCount: number;
  activeLeadsCount: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

interface QueueRule {
  uuid: string;
  name: QueueRuleNames;
  description: string;
}

interface DistributionReportFilters {
  status?: DistributionReportStatus;
  lead?: string;
  queue?: string;
  user?: string;
  startDate?: string;
  endDate?: string;
}

interface DistributionReportData {
  offerUuid: string;
  status: DistributionReportStatus;
  offeredAt: string;
  expiresAt: string;
  createdAt: string;
  leadUuid: string;
  leadName: string;
  leadPhone: string;
  leadEmail: string;
  userUuid: string;
  userName: string;
  userEmail: string;
  queueUuid: string;
  queueName: string;
}

interface TaskFilters {
  startDate?: string;
  endDate?: string;
  leadUuid?: string;
  userId?: string;
  search?: string;
  taskTypeCode?: string;
}

interface SaleActionFilters {
  queueUuid?: string;
  inProgress?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
}

interface SaleActionMetricData {
  queuesAmount: number;
  queueExecutionsInProgress: number;
  engagedParticipants: number;
  offersPending: number;
}

interface SaleActionItem {
  uuid: string;
  queueUuid: string;
  queueName: string;
  queueDescription: string;
  inProgress: boolean;
  startDate: string;
  endDate: string;
  activeUsers: number;
  totalUsers: number;
  offersSent: number;
  leadsDistributed: number;
  updatedAt: string;
}

interface SaleActionDetailParticipant {
  userUuid: string;
  name: string;
  email: string;
  status: SaleActionDetailParticipantStatus;
  offersReceived: number;
  distributions: number;
  engagementPercent: number;
  lastUpdate: string;
}

interface SaleActionDetail {
  uuid: string;
  queueUuid: string;
  queueName: string;
  queueDescription: string;
  inProgress: boolean;
  startDate: string;
  endDate: string;
  activeUsers: number;
  totalUsers: number;
  offersSent: number;
  leadsDistributed: number;
  updatedAt: string;
  participants: SaleActionDetailParticipant[];
}

interface CaptationFilters {
  status?: CaptationStatus;
  origin?: LeadOriginType;
  teamUuid?: string;
  selectedCatcher?: SelectedItem | null;
  queueUuid?: string;
  startDate?: string;
  endDate?: string;
}

interface CaptationItem {
  uuid: string;
  offeredAt: string;
  leadName: string;
  leadEmail: string;
  phone: string;
  origin: string;
  catcherName: string;
  queueName: string;
  teamName: string;
  status: string;
  productTitle: string;
}

interface CheckinItem {
  queueUuid: string;
  queueName: string;
  queueDescription: string;
  queueColor: string;
  queueIsActive: boolean;
  executionUuid: string;
  hasActiveExecution: boolean;
  checkedIn: boolean;
}

interface RedistributionFilters {
  reasonUuid?: string;
  selectedCatcher?: SelectedItem | null;
  queueUuid?: string;
  originType?: LeadOriginType;
  startDate?: string;
  endDate?: string;
  archivedStartDate?: string;
  archivedEndDate?: string;
}

interface ImoviewIntegrationData {
  uuid: string;
  email: string;
  apiKey: string;
  isActive: boolean;
  accessCode: string;
  userCode: string;
  accessCodeExpiredAt: string;
  userCodeExpiredAt: string;
  createdAt: string;
  updatedAt: string;
}

interface CnmIntegrationData {
  uuid: string;
  token: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LaisIntegrationData {
  uuid: string;
  isActive: boolean;
  integrationKey: string;
  createdAt: string;
  updatedAt: string;
}

interface DwvIntegrationData {
  uuid: string;
  token: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationItem {
  uuid: string;
  integrationType: IntegrationType;
  status: IntegrationJobStatus;
  startedAt: string;
  finishedAt: string;
  errorMessage: string;
  step: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationItem {
  uuid: string;
  title: string;
  description: string;
  isViewed: boolean;
  viewedAt: string;
  targetEntityType: NotificationTargetType;
  targetEntityUuid: string;
  createdAt: string;
  updatedAt: string;
}

interface RedistributionItem {
  uuid: string;
  name: string;
  phone1: string;
  phone2: string;
  email: string;
  originType: string;
  archiveReason: string;
  archiveReasonUuid: string;
  catcher: {
    uuid: string;
    name: string;
    email: string;
    phone: string;
  };
  productTitle: string;
  productPrice: number;
  negotiationType: string;
  archivedAt: string;
  createdAt: string;
}

interface RedistributionBatchJobItem {
  jobId: string;
  status: RedistributionBatchJobItemStatus;
  fileName: string;
  errorMessage: string;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
}

interface RedistributionUploadUrlItem {
  uploadUrl: string;
  fileName: string;
  expiresIn: number;
}

interface FunnelLeadsFilters {
  startDate?: string;
  endDate?: string;
  catcherUuid?: string;
  funnelType?: FunnelDirection;
  unitUuid?: string;
  originType?: LeadOriginType;
}

interface AppleCalendarStatus {
  connected: boolean;
  connectedAt: string;
  calendarUrl: string;
  lastConnectionSuccessful: boolean;
}

interface PaymentItem {
  paymentId: string;
  value: number;
  invoiceUrl: string;
  paymentDate: string;
  description: string;
}

interface NewSubscriptionPlanChangeItem {
  message: string;
  pendingChangeUuid: string;
  currentPlanName: string;
  newPlanName: string;
  newPaymentPeriod: string;
  newPlanPrice: number;
  effectiveDate: string;
  billingType: PaymentBillingType;
  isUpgrade: boolean;
  scheduled: boolean;
  asaasPaymentId: string;
  paymentStatus: string;
  creditCardPaymentProcessed: boolean;
  pixPayload: string;
  pixQrCodeBase64: string;
  pixExpirationDate: string;
  boletoUrl: string;
  boletoBarCode: string;
  boletoDueDate: string;
}

interface SubscriptionPlanChangeItem {
  uuid: string;
  currentPlanId: number;
  currentPlanName: string;
  newPlanId: number;
  newPlanName: string;
  currentPaymentPeriod: string;
  newPaymentPeriod: string;
  newSignaturePrice: number;
  effectiveDate: string;
  status: PlanStatus;
  paymentLink: string;
  createdAt: string;
  isUpgrade: boolean;
}

interface GlobalSearchFilters {
  query: string;
  types: GlobalSearchTypes;
  page: number;
  size: number;
}

interface GlobalSearchResultItem {
  type: GlobalSearchTypes;
  uuid: string;
  title: string;
  subtitle: string;
  metadata: string;
}

interface GlobalSearchResponse {
  results: GlobalSearchResultItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface CouponValidationData {
  code: string;
  valid: boolean;
  discountPercentage: number;
  description: string;
  message: string;
}

interface CouponListItem {
  uuid: string;
  code: string;
  description: string;
  discountPercentage: number;
  couponType: CouponListType;
  expirationDate: string;
  isActive: boolean;
  usageCount: number;
  isExpired: boolean;
  isValid: boolean;
  createdAt: string;
}

interface NotificationReminderTemplateItem {
  uuid: string;
  name: string;
  messageText: string;
  notificationType: NotificationType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationReminderItem {
  uuid: string;
  userUuid: string;
  notificationType: NotificationType;
  frequency: NotificationFrequency;
  dayOfWeek: DayOfWeek;
  dayOfMonth: number;
  reminderTime: string;
  isActive: boolean;
  isEnabled: boolean;
  templateUuid: string;
  template: NotificationReminderTemplateItem;
  createdAt: string;
  updatedAt: string;
}

interface NotificationReminderBatchResponseErrorItem {
  userUuid: string;
  reminderUuid: string;
  errorMessage: string;
}

interface NotificationReminderBatchResponse {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  successItems: NotificationReminderItem[];
  errors: NotificationReminderBatchResponseErrorItem[];
}

interface NotificationTemplateItem {
  uuid: string;
  name: string;
  messageText: string;
  notificationType: NotificationType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export {
  PropertyType,
  PropertyMediaFeature,
  PropertyStatus,
  FurnishedStatus,
  PropertySituation,
  PropertyDestination,
  PropertySecondaryType,
  PropertyPurpose,
  PropertyGarageType,
  PropertyReadinessStatus,
  PropertyNoteType,
  LeadOriginType,
  LeadNegotiationType,
  LeadFunnelStages,
  LeadIntensityType,
  LeadStatusType,
  WeekDays,
  LeadCreditApprovalStatus,
  LeadPaymentConditionTypes,
  LeadPaymentExchangeType,
  LeadPaymentPriceIndex,
  LeadProposalStatus,
  CommissionAgentType,
  LeadQualification,
  WhatsappSessionStatus,
  PropertyQualification,
  PlanNames,
  DayOfWeek,
  PropertyFeatureType,
  CondominiumFeatureType,
  OverlaySettingPosition,
  QueueRuleOperationTypes,
  QueueRuleNames,
  SaleActionDetailParticipantStatus,
  CaptationStatus,
  IntegrationType,
  IntegrationJobStatus,
  PropertyConstructionStatus,
  PropertyLaunchType,
  PropertyPositionType,
  FunnelDirection,
  PropertyKeychainStatus,
  DistributionCheckinEventType,
  PaymentPeriodType,
  PaymentBillingType,
  PlanStatus,
  DistributionReportStatus,
  PropertySignStatus,
  NotificationTargetType,
  CouponListType,
  NotificationType,
  NotificationFrequency,
  RedistributionBatchJobItemStatus,
};

export type {
  NavItem,
  ModalProps,
  RegisterStepItem,
  RegisterFormType,
  UserInformation,
  SignatureInfoStatus,
  Plan,
  Permission,
  Record,
  Client,
  PropertyFeature,
  PropertySecondaryDistrict,
  PropertyDetail,
  PropertyMedia,
  PropertyFullFormData,
  PropertyDimensions,
  PropertyBuilder,
  CondominiumDetail,
  CatcherItem,
  LeadDetail,
  AuditEvent,
  RoulleteSettings,
  TeamDetail,
  TeamMember,
  CreditAnalyseItem,
  CreditAnalyseDocument,
  LeadAdditionalInfoItem,
  LeadUpdateItem,
  LeadPropertyItem,
  LeadProposalItem,
  LeadBankItem,
  LeadClosedDealItem,
  LeadFunnelItem,
  LeadManageConversionMetrics,
  LeadManagePerformanceMetrics,
  LeadQualificationTimeMetrics,
  PropertyMetricsItem,
  PropertyMetricTopPropertyStatusesItem,
  PropertyMetricCaptationStatusSummaryItem,
  PropertyMetricCaptationSummaryItem,
  WhatsappSessionStatusItem,
  UserLeadQualificationMetricItem,
  UserPropertyQualificationMetricItem,
  PropertyQualificationUpdateMetrics,
  KanbanColumn,
  KanbanBoard,
  CondominiumFeature,
  PropertyPreferenceHistoryItem,
  PropertyFilters,
  ArchiveReason,
  PropertyVisiting,
  PropertyGeneralMetrics,
  UserProfileMetrics,
  OverlaySetting,
  PropertiesReportFilters,
  LeadsReportFilters,
  PropertyReportData,
  PropertyReportSummaryData,
  LeadsReportSummaryData,
  LeadsReportData,
  CatchersReportFilters,
  CatcherReportData,
  ScheduleReportFilters,
  ScheduleReportData,
  ExportHistoryData,
  QueueItem,
  QueueRule,
  QueueItemDetail,
  QueueItemDetailUser,
  QueueFilters,
  TaskFilters,
  UnitDetail,
  SaleActionFilters,
  SaleActionDetail,
  SaleActionMetricData,
  SaleActionItem,
  CaptationFilters,
  CaptationItem,
  RedistributionFilters,
  LeadsDashboardFilters,
  LeadsDashboardItem,
  SixWeekSalesFunnelItem,
  AttendanceType,
  LeadsDashboardThermometerItem,
  ArchivedByChannelItem,
  ImoviewIntegrationData,
  IntegrationItem,
  RoulleteLastOfferItem,
  NotificationItem,
  RedistributionItem,
  RedistributionBatchJobItem,
  RedistributionUploadUrlItem,
  RoulleteRankingData,
  RoulleteRankingUserItem,
  RoulleteNextQueueSettings,
  RoulleteNextQueueUserItem,
  CnmIntegrationData,
  LeadByItem,
  TopPropertiesItem,
  FunnelLeadsFilters,
  DeactivateUserMetricsData,
  NegotiationFilters,
  PropertyKeychainItem,
  PropertyOwnerAssignmentItem,
  PropertyCatcherAssignmentItem,
  DwvIntegrationData,
  CheckinItem,
  LeadQualificationTimesItem,
  LaisIntegrationData,
  ArchivedByReasonItem,
  PropertyQualificationTimesItem,
  LeadImportJobItem,
  AppleCalendarStatus,
  PaymentItem,
  SubscriptionPlanChangeItem,
  NewSubscriptionPlanChangeItem,
  GlobalSearchFilters,
  GlobalSearchResponse,
  GlobalSearchResultItem,
  DistributionReportFilters,
  DistributionReportData,
  CouponValidationData,
  CouponListItem,
  NotificationReminderItem,
  NotificationReminderTemplateItem,
  NotificationReminderBatchResponse,
  NotificationTemplateItem,
};
