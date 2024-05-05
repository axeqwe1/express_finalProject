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
            requestForRepair:require('./action/requestForRepair_ac'),
            assignWork:require('./action/assignwork_ac'),
            repairDetail:require('./action/repairDetail_ac')
        },
    manageimage:
        {
            getlistImage:require('./manage-image/getListImage')
        },
    auth:
        {
            auth:require('./auth/auth')
        },
    display:
        {
            requestDisplay:require('./display/requestDisplay') 
        }
}

module.exports = router