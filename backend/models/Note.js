const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "notes",
  }
);

User.hasMany(Note, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Note.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = Note;