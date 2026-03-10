import asyncHandler from 'express-async-handler';
import Content from '../models/Content.js';

// @desc    Get content by page name
// @route   GET /api/content/:page
// @access  Public
const getContent = asyncHandler(async (req, res) => {
  const content = await Content.findOne({ page: req.params.page });
  if (content) {
    res.json(content);
  } else {
    // Return empty sections if page not found, rather than 404, to simplify frontend logic
    res.json({ page: req.params.page, sections: {} });
  }
});

// @desc    Update content for a page
// @route   PUT /api/content/:page
// @access  Private/Admin
const updateContent = asyncHandler(async (req, res) => {
  const { sections } = req.body;
  const pageName = req.params.page;

  let content = await Content.findOne({ page: pageName });

  if (content) {
    content.sections = sections;
    const updatedContent = await content.save();
    res.json(updatedContent);
  } else {
    content = new Content({
      page: pageName,
      sections: sections,
    });
    const createdContent = await content.save();
    res.status(201).json(createdContent);
  }
});

export { getContent, updateContent };
