-- AlterTable
ALTER TABLE `ThreedRef` ADD COLUMN `backgroundColor` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imageRefEtag` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `ThreedRef` ADD CONSTRAINT `ThreedRef_imageRefEtag_fkey` FOREIGN KEY (`imageRefEtag`) REFERENCES `ImageRef`(`etag`) ON DELETE SET NULL ON UPDATE CASCADE;