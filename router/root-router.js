const router = {
    management:
        {
            admin:require('./management/admin-management'),
            employee:require('./management/employee-management'),
            technician:require('./management/technician-management'),
            technicianStatus:require('./management/techStatus_management'),
            building:require('./management/building-management'),
            department:require('./management/department-management'),
            levelOfDamage:require('./management/levelofdamage-management'),
            equipment:require('./management/equipment-management'),
            equipmentType:require('./management/equipmentType-management'),
            chief:require('./management/chief-management')
        },
    action:
        {
            
        }
}

module.exports = router