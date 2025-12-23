# Sora2 角色创建功能

## 功能说明

已成功接入 Sora2 的角色创建功能，允许用户从生成的视频中提取并创建角色。

## API 接口

### 后端路由
- **POST** `/api/videos/characters` - 创建 Sora2 角色

### 请求参数
```typescript
{
  timestamps: string;  // 例如 '1,2' 表示视频的1～2秒（范围差值最大3秒最小1秒）
  url?: string;        // 视频URL（包含需要创建的角色，视频必须有声音、有角色）
  from_task?: string;  // 任务ID（根据已生成的任务创建角色）
}
```

**注意**：`url` 和 `from_task` 二选一，必须设置一个。

### 响应示例
```json
{
  "success": true,
  "data": {
    "id": "ch_691155df38588191b3ae5f2d390a4359",
    "username": "saparpomd.oddwingduo",
    "permalink": "https://sora.chatgpt.com/profile/saparpomd.oddwingduo",
    "profile_picture_url": "https://videos.openai.com/..."
  }
}
```

## 前端集成

### API 调用函数
在 `src/services/api.ts` 中新增：
- `createSora2Character()` - 创建角色

### UI 功能
在 `CharacterModal` 组件中：
1. **生成视频** - 使用 Sora2 生成角色视频
2. **确认形象** - 从生成的视频中提取角色（使用视频的1-2秒）
3. **状态显示** - 显示创建进度和结果

### 角色数据结构
```typescript
interface Character {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  taskId?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: number;
  // Sora2 角色信息
  characterId?: string;        // Sora2 角色ID
  username?: string;           // Sora2 角色用户名
  permalink?: string;          // Sora2 角色主页链接
  profilePictureUrl?: string;  // Sora2 角色头像URL
}
```

## 使用流程

1. 用户在角色模态框中输入角色描述
2. 点击"生成视频"按钮，调用 Sora2 生成角色视频
3. 视频生成完成后，点击"确认形象"按钮
4. 系统自动从视频的1-2秒提取角色信息
5. 创建成功后，保存角色的 Sora2 信息（ID、用户名、头像等）

## 技术细节

- 使用 `from_task` 参数从已生成的视频任务中创建角色
- 默认提取视频的1-2秒作为角色片段
- 创建成功后，使用 Sora2 返回的头像作为角色缩略图
- 按钮状态：未生成视频时禁用，创建中显示加载动画，创建成功显示绿色确认状态
