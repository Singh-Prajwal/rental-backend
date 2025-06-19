// src/controllers/aiController.ts
import { Request, Response } from 'express';
import { knowledgeBase } from '../ai/knowledgeBase';

export const getAiSupportAnswer:any = (req: Request, res: Response) => {
  const { appliance, question } = req.body;

  if (!appliance || !question) {
    return res.status(400).json({ message: 'Appliance and question are required.' });
  }

  const knowledge = knowledgeBase[appliance];

  if (!knowledge) {
    return res.status(404).json({ answer: `Sorry, I don't have information about the "${appliance}". Please contact your host directly.` });
  }

  const questionLower = question.toLowerCase();

  // Find a keyword in the user's question
  for (const keyword in knowledge.keywords) {
    if (questionLower.includes(keyword)) {
      return res.json({ answer: knowledge.keywords[keyword] });
    }
  }

  // If no keyword is found, return the default response
  return res.json({ answer: knowledge.default });
};