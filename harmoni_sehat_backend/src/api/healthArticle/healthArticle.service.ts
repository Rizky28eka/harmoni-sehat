import HealthArticle, { IHealthArticle } from '../../models/HealthArticle';
import { AppError } from '../../utils/AppError';

class HealthArticleService {
  async createHealthArticle(data: Partial<IHealthArticle>): Promise<IHealthArticle> {
    const existingArticle = await HealthArticle.findOne({ slug: data.slug });
    if (existingArticle) {
      throw new AppError('Artikel dengan slug tersebut sudah ada', 409);
    }
    const healthArticle = await HealthArticle.create(data);
    return healthArticle;
  }

  async getAllHealthArticles(): Promise<IHealthArticle[]> {
    const healthArticles = await HealthArticle.find().populate('penulis_id');
    return healthArticles;
  }

  async getHealthArticleById(id: string): Promise<IHealthArticle> {
    const healthArticle = await HealthArticle.findById(id).populate('penulis_id');
    if (!healthArticle) {
      throw new AppError('Artikel kesehatan tidak ditemukan', 404);
    }
    return healthArticle;
  }

  async updateHealthArticle(id: string, data: Partial<IHealthArticle>): Promise<IHealthArticle> {
    const healthArticle = await HealthArticle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!healthArticle) {
      throw new AppError('Artikel kesehatan tidak ditemukan', 404);
    }
    return healthArticle;
  }

  async deleteHealthArticle(id: string): Promise<void> {
    const healthArticle = await HealthArticle.findByIdAndDelete(id);
    if (!healthArticle) {
      throw new AppError('Artikel kesehatan tidak ditemukan', 404);
    }
  }
}

export default new HealthArticleService();