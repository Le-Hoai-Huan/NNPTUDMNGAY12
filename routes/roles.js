var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let data = await roleModel.find({
            isDeleted: false
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({
            isDeleted: false,
            _id: id
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// GET all users with a specific role
router.get('/:id/users', async function (req, res, next) {
    try {
        let roleId = req.params.id;
        let userModel = require('../schemas/users');
        
        // First check if role exists
        let role = await roleModel.findOne({
            isDeleted: false,
            _id: roleId
        });
        
        if (!role) {
            return res.status(404).send({
                message: "ROLE NOT FOUND"
            });
        }
        
        // Get all users with this role
        let users = await userModel.find({
            isDeleted: false,
            role: roleId
        }).populate({
            path: 'role',
            select: 'name description'
        });
        
        res.send(users);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// CREATE role
router.post('/', async function (req, res) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// UPDATE role
router.put('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// SOFT DELETE role
router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({
            isDeleted: false,
            _id: id
        });
        if (result) {
            result.isDeleted = true;
            await result.save();
            res.send(result);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

module.exports = router;
