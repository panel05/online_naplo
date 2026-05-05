const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Cím és tartalom megadása kötelező." });
    }

    const note = await Note.create({
      title,
      content,
      category,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Jegyzet létrehozva.",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a jegyzet létrehozásakor." });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a jegyzetek lekérésekor." });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const note = await Note.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Jegyzet nem található." });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.category = category !== undefined ? category : note.category;

    await note.save();

    res.json({
      message: "Jegyzet frissítve.",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a jegyzet frissítésekor." });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Jegyzet nem található." });
    }

    await note.destroy();

    res.json({ message: "Jegyzet törölve." });
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a jegyzet törlésekor." });
  }
};