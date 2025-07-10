import Media, { IMedia } from '../../models/Media';
import { AppError } from '../../utils/AppError';

class MediaService {
  async createMedia(data: Partial<IMedia>): Promise<IMedia> {
    const media = await Media.create(data);
    return media;
  }

  async getAllMedia(): Promise<IMedia[]> {
    const media = await Media.find();
    return media;
  }

  async getMediaById(id: string): Promise<IMedia> {
    const media = await Media.findById(id);
    if (!media) {
      throw new AppError('Media tidak ditemukan', 404);
    }
    return media;
  }

  async updateMedia(id: string, data: Partial<IMedia>): Promise<IMedia> {
    const media = await Media.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!media) {
      throw new AppError('Media tidak ditemukan', 404);
    }
    return media;
  }

  async deleteMedia(id: string): Promise<void> {
    const media = await Media.findByIdAndDelete(id);
    if (!media) {
      throw new AppError('Media tidak ditemukan', 404);
    }
  }
}

export default new MediaService();