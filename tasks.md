# CMMS Schema Improvement Tasks

## High Priority — Core CMMS

- [ ] Add WorkOrder → Inventory Transaction (traceable stock usage)
  - [ ] Create `InventoryTransaction` model with fields: `id`, `partId`, `type`, `quantity`, `relatedWorkOrderId`, `note`, `createdAt`
  - [ ] Add relation from `InventoryTransaction` to `Part`
  - [ ] Add relation from `WorkOrder` to `InventoryTransaction`
  - [ ] Update `WorkOrderCost` to optionally backfill `partUsedId` from transaction
  - [ ] Add database index on `InventoryTransaction.partId` + `relatedWorkOrderId`

- [ ] Add Asset Component/Sub-asset hierarchy
  - [ ] Create `AssetComponent` model with fields: `id`, `parentId`, `childId`, `quantity`
  - [ ] Add self-relation `parent Asset` and `child Asset`
  - [ ] Add cascade delete on parent/child
  - [ ] Add unique constraint on `(parentId, childId)`

- [ ] Add Failure/Fault Code per Company
  - [ ] Create `FailureCode` model with fields: `id`, `companyId`, `code`, `name`, `description`, `category`
  - [ ] Add relation from `FailureCode` to `Company`
  - [ ] Add relation from `WorkOrder` to `FailureCode` (optional)
  - [ ] Add relation from `PreventiveMaintenance` to `FailureCode` (optional)

- [ ] Add Asset Meter Reading for predictive trigger
  - [ ] Create `AssetMeter` model with fields: `id`, `assetId`, `type`, `value`, `unit`, `readingAt`
  - [ ] Add relation from `AssetMeter` to `Asset`
  - [ ] Add relation from `WorkOrder` to `AssetMeter` (optional)
  - [ ] Add relation from `PreventiveMaintenance` to `AssetMeter` (optional)

## Medium Priority

- [ ] Add Vendor/Contractor entity
  - [ ] Create `Vendor` model with fields: `id`, `companyId`, `name`, `email`, `phone`, `address`, `notes`
  - [ ] Add relation from `Vendor` to `Company`
  - [ ] Add relation from `WorkOrder` to `Vendor` (optional)

- [ ] Promote WorkOrderType to master data
  - [ ] Create `WorkOrderType` model with fields: `id`, `companyId`, `name`, `description`
  - [ ] Replace `WorkOrderType` enum with relation

- [ ] Add Employee labor/billing rate and shift defining
  - [ ] Add `laborRate` to `Employee`
  - [ ] Add `shift` to `Employee`
  - [ ] Add relation from `Employee` to `Company`

- [ ] Add Warranty asset/part with start/end date
  - [ ] Create `Warranty` model with fields: `id`, `assetId` or `partId`, `startDate`, `endDate`, `provider`, `notes`
  - [ ] Add relation from `Warranty` to `Asset`
  - [ ] Add relation from `Warranty` to `Part`

## Low Priority / Future

- [ ] Add Maintenance Schedule entity with custom recurrence and trigger rules
- [ ] Add Calibration schedule
- [ ] Add Document management system
- [ ] Add Downtime tracking
- [ ] Add Custom PM pattern
