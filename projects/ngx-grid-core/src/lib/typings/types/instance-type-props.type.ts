export type TInstanceTypeProps<T extends Record<keyof T, new (...args: any) => any>> = { [K in keyof T]: InstanceType<T[K]> };
