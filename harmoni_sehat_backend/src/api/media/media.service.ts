import Media, { IMedia } from '../../models/Media';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateMediaInput, UpdateMediaInput } from './media.validation';

class MediaService {
  async createMedia(mediaData: CreateMediaInput): Promise<IMedia> {
    // Basic validation for model_id existence (optional, can be done in controller if needed)
    if (!Types.ObjectId.isValid(mediaData.model_id)) {
      throw new AppError('Invalid Model ID', 400);
    }
    const newMedia = await Media.create(mediaData);
    return newMedia;
  }

  async getAllMedia(): Promise<IMedia[]> {
    return Media.find();
  }

  async getMediaById(mediaId: string): Promise<IMedia | null> {
    if (!Types.ObjectId.isValid(mediaId)) {
      throw new AppError('Invalid Media ID', 400);
    }
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new AppError('Media not found', 404);
    }
    return media;
  }

  async getMediaByModel(modelType: string, modelId: string): Promise<IMedia[]> {
    if (!Types.ObjectId.isValid(modelId)) {
      throw new AppError('Invalid Model ID', 400);
    }
    return Media.find({ model_type: modelType, model_id: modelId });
  }

  async updateMedia(mediaId: string, mediaData: UpdateMediaInput): Promise<IMedia | null> {
    if (!Types.ObjectId.isValid(mediaId)) {
      throw new AppError('Invalid Media ID', 400);
    }
    const media = await Media.findByIdAndUpdate(mediaId, mediaData, { new: true, runValidators: true });
    if (!media) {
      throw new AppError('Media not found', 404);
    }
    return media;
  }

  async deleteMedia(mediaId: string): Promise<void> {
    if (!Types.ObjectId.isValid(mediaId)) {
      throw new AppError('Invalid Media ID', 400);
    }
    const media = await Media.findByIdAndDelete(mediaId);
    if (!media) {
      throw new AppError('Media not found', 404);
    }
  }
}

export default new MediaService();
