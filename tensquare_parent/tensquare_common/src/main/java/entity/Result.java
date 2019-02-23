package entity;

import lombok.Data;

@Data
public class Result {
    // 是否成功
    private Boolean flag;
    // 返回码
    private Integer code;
    // 返回信息
    private String message;
    // 返回数据
    private Object data;

    /**
     * 控构造器
     */
    public Result() {
    }

    public Result(Boolean flag, Integer code, String message) {
        this.flag = flag;
        this.code = code;
        this.message = message;
    }

    public Result(Boolean flag, Integer code, String message, Object data) {
        this.flag = flag;
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
