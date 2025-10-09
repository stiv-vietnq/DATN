package com.coverstar.service.momo;

import com.coverstar.config.momo.ConfigEnvironment;
import com.coverstar.config.momo.PartnerInfo;
import com.coverstar.exception.MoMoException;
import com.coverstar.utils.Execute;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public abstract class AbstractProcess<T, V> {

    protected PartnerInfo partnerInfo;
    protected ConfigEnvironment configEnvironment;
    protected Execute execute = new Execute();

    public AbstractProcess(ConfigEnvironment configEnvironment) {
        this.configEnvironment = configEnvironment;
        this.partnerInfo = configEnvironment.getPartnerInfo();
    }

    public static Gson getGson() {
        return new GsonBuilder()
                .disableHtmlEscaping()
                .create();
    }

    public abstract V execute(T request) throws MoMoException;
}
