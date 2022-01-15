
class CacheCenter {
  private static instance: CacheCenter; // 实例

  // 单例模式
  public static get singleInstance (): CacheCenter {
    if (!CacheCenter.instance) {
      CacheCenter.instance = new CacheCenter()
    }
    return CacheCenter.instance
  }

  // 新增缓存
  public add(keyName: string, keyValue: string): void {
    localStorage.setItem(keyName, keyValue)
  }

  // 读取缓存
  public read(keyName: string): string | null {
    return localStorage.getItem(keyName)
  }

  // 移除缓存
  public remove(keyName: string): void {
    localStorage.removeItem(keyName)
  }
}

export default CacheCenter.singleInstance
