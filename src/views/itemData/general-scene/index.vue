<template>
  <div class="general_data_contain">
    <el-row :gutter="24">
      <el-col style="margin-bottom: 20px; text-align: right"
        ><el-button
          icon="el-icon-arrow-left"
          class="pan-back-btn"
          @click="back"
        >
          返回
        </el-button></el-col
      >
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}基础数据</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template #default>
            <el-descriptions
              :column="2"
              size=""
              :colon="false"
              direction="vertical"
              :contentStyle="{
                'font-size': '24px',
                'line-height': '36px',
                color: '#3ba0ff',
              }"
            >
              <el-descriptions-item>
                <template slot="label"> 已激活设备量 </template>
                {{ overviewBase.activeDeveice }}台
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 已激活设备总量 </template>
                {{ overviewBase.activeTotal }}台
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 有效项目量 </template>
                {{ overviewBase.validPro }}个
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 项目总量 </template>
                {{ overviewBase.totalPro }}个
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="16"
        :xl="16"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}已激活设备总量/项目总量分布</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template #default>
            <el-descriptions
              :column="4"
              size=""
              :colon="false"
              direction="vertical"
              :contentStyle="{
                'font-size': '24px',
                'line-height': '36px',
                color: '#3ba0ff',
              }"
            >
              <el-descriptions-item
                v-for="item in overviewBase.regionVO"
                :key="item.label"
              >
                <template slot="label">
                  {{ item.region }}
                </template>
                {{ item.devCount }}台/{{ item.activeProCount }}个
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="display: flex; align-items: center"
            >
              <el-form-item>
                <time-select
                  @childChangePeriod="changePeriod"
                  @childChangeDateRange="changeDateRange"
                ></time-select>
              </el-form-item>
              <el-form-item>
                <ReArea
                  @fromChildArea="getOverviewAreaData"
                  ref="areaRef"
                  :handleArea="handleArea"
                ></ReArea>
              </el-form-item>
              <el-form-item>
                <el-select
                  placeholder="请选择软件类型"
                  v-model="overviewInfo.softType"
                >
                  <el-option value="" label="">全部</el-option>
                  <el-option
                    v-for="item in overviewDevices"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  placeholder="请选择硬件类型"
                  v-model="overviewInfo.hardType"
                >
                  <el-option value="" label="">全部</el-option>
                  <el-option
                    v-for="item in overviewHardType"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="overviewInfo.version"
                  filterable
                  remote
                  reseve-keyword
                  allow-create
                  placeholder="请输入版本号"
                  :remote-method="changeVersion"
                  clearable
                >
                  <el-option
                    v-for="item in overviewVersion"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleOverview(), setOverviewCard()"
                  >查询</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="useReset"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </template>
          <template #default>
            <el-row :gutter="24">
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12"
                class="generl_info"
              >
                <div class="title">
                  昨日新增激活设备量(台数)：<span class="count">{{
                    cardInfo.increRobot
                  }}</span
                  ><tool-tip :content="tip"></tool-tip>
                </div>
                <div class="compare">
                  <span> 较前日 </span>
                  <svg-icon
                    :icon-class="
                      cardInfo.increRobotAdd > 0 ? 'welcome4' : 'welcome5'
                    "
                  />
                  <span class="count"> {{ cardInfo.increRobotAdd }} </span>
                </div>
                <div class="active">
                  近7日激活：<span class="count" style="margin-right: 15px">{{
                    cardInfo.curRobot7d
                  }}</span
                  >近30日激活：<span class="count">{{
                    cardInfo.curRobot30d
                  }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12"
                class="generl_info"
              >
                <div class="title">
                  昨日新增项目数：<span class="count">{{
                    cardInfo.increProject
                  }}</span>
                  <tool-tip :content="tip"></tool-tip>
                </div>
                <div class="compare">
                  <span> 较前日 </span>
                  <svg-icon
                    :icon-class="
                      cardInfo.increProjectAdd > 0 ? 'welcome4' : 'welcome5'
                    "
                  />
                  <span class="count"> {{ cardInfo.increProjectAdd }} </span>
                </div>
                <div class="active">
                  近7日新增：<span class="count" style="margin-right: 15px">{{
                    cardInfo.curProject7d
                  }}</span
                  >近30日激活：<span class="count">{{
                    cardInfo.curProject30d
                  }}</span>
                </div>
              </el-col>
            </el-row>
            <ReLine
              :index="2"
              :trendXData="trendXData"
              :series="trendSeries"
              :colorList="colorList"
              :legendData="legend"
              v-if="trendSeries.length > 0"
            >
            </ReLine>
            <el-collapse @change="handleChange">
              <el-collapse-item :title="collapseTitle" class="collapseText">
                <div class="list_container">
                  <div class="list_top">
                    <tool-tip
                      :content="tip"
                      style="margin-right: 15px"
                    ></tool-tip>

                    <el-button type="primary" @click="exportData"
                      >导出</el-button
                    >
                  </div>
                </div>
                <el-table style="width: 100%" :data="overviewTable.list">
                  <el-table-column
                    v-for="(item, index) in getKeys('overviewTable')"
                    :key="index"
                    :prop="item"
                    align="center"
                    :label="overviewTable.header[0][item]"
                  >
                  </el-table-column>
                </el-table>
                <pagination
                  :total="overviewTable.total"
                  :page-size="overviewTable.pageSize"
                  @pageChange="overviewTurnPage"
                  @sizeChange="overviewSizeChange"
                ></pagination>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}售卖类型占比</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template #default>
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="display: flex; align-items: center"
            >
              <el-form-item>
                <el-autocomplete
                  v-model="sellModelInfo.projectName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入项目"
                  @select="handleSellModel"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item>
                <ReArea
                  @fromChildArea="getSellModelAreaData"
                  ref="areaRef"
                  :handleArea="handleArea"
                ></ReArea>
              </el-form-item>
            </el-form>
            <div class="circle">
              <ReCircle
                :index="1"
                :chartData="sellModelChart"
                :colors="circleColors"
                v-if="sellModelChart.length != 0"
                unit="台"
              ></ReCircle>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}设备类型占比</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template default>
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="display: flex; align-items: center"
            >
              <el-form-item>
                <el-autocomplete
                  v-model="deviceModelInfo.projectName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入项目"
                  @select="handleDeviceModel"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item>
                <ReArea
                  @fromChildArea="getDeviceModelAreaData"
                  ref="areaRef"
                  :handleArea="handleArea"
                ></ReArea>
              </el-form-item>
              <el-form-item>
                <el-select
                  placeholder="硬件类型"
                  v-model="deviceModelInfo.deviceType"
                  @change="handleDeviceModel"
                >
                  <el-option value="" label="">全部</el-option>
                  <el-option
                    v-for="item in overviewHardType"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="circle">
              <ReCircle
                :index="2"
                :colors="circleColors"
                :chartData="deviceModelChart"
                v-if="deviceModelChart.length != 0"
                unit="台"
              ></ReCircle>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}版本分布</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template #default>
            <div class="general_flex">
              <el-form
                :inline="true"
                class="demo-form-inline"
                style="display: flex; align-items: center"
              >
                <el-form-item>
                  <el-select
                    placeholder="设备类型"
                    v-model="versionModelInfo.deviceType"
                    @change="handleVersionModel"
                  >
                    <el-option value="" label="">全部</el-option>
                    <el-option
                      v-for="item in overviewDevices"
                      :key="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    placeholder="全部版本"
                    v-model="versionModelInfo.version"
                    @change="handleVersionModel"
                  >
                    <el-option value="" label="">全部</el-option>
                    <el-option
                      v-for="item in overviewVersions"
                      :key="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <ReArea
                    @fromChildArea="getVersionAreaData"
                    ref="areaRef"
                    :handleArea="handleArea"
                  ></ReArea>
                </el-form-item>
                <el-form-item>
                  <el-autocomplete
                    v-model="versionModelInfo.projectName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入项目"
                    @select="handleVersionModel"
                  >
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.value }}</div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-form>
            </div>
            <div class="circle">
              <ReCircle
                :index="4"
                :chartData="versionModelChart"
                :colors="circleColors"
                v-if="versionModelChart.length != 0"
                unit="台"
              ></ReCircle>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}语音对话数据</span>
            <tool-tip
              content="统计数据取已激活设备，日期截止到12.9日"
            ></tool-tip>
          </template>
          <template default>
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="display: flex; align-items: center; line-height: 77px"
            >
              <el-form-item>
                <el-select
                  placeholder="设备类型"
                  v-model="aiFilterInfo.deviceType"
                  @change="setAiVoiceInfo"
                >
                  <el-option value="" label="">全部</el-option>
                  <el-option
                    v-for="item in overviewDevices"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <ReArea
                  @fromChildArea="getAiVoiceAreaData"
                  ref="areaRef"
                  :handleArea="handleArea"
                ></ReArea>
              </el-form-item>
              <el-form-item>
                <el-autocomplete
                  v-model="aiFilterInfo.projectName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入项目"
                  @select="setAiVoiceInfo"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item>
                <el-select
                  placeholder="全部版本"
                  v-model="aiFilterInfo.version"
                  @change="setAiVoiceInfo"
                >
                  <el-option value="" label="">全部</el-option>
                  <el-option
                    v-for="item in overviewVersions"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-descriptions
              :column="2"
              size=""
              :colon="false"
              direction="vertical"
              :contentStyle="{
                'font-size': '24px',
                'line-height': '36px',
                color: '#3ba0ff',
              }"
            >
              <el-descriptions-item>
                <template slot="label"> 今日实时对话次数 </template>
                {{ aiVoiceInfo.todayVoiceCount }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 昨日对话数量(次数) </template>
                {{ aiVoiceInfo.yesterdayVoiceCount }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label"> 累计对话数量(次数) </template>
                {{ aiVoiceInfo.totalVoiceCount }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label"> 累计有效对话数量(次数) </template>
                {{ aiVoiceInfo.totalValidVoiceCount }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label"> 累计无效对话数量(次数) </template>
                {{ aiVoiceInfo.totalInValidVoiceCount }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #default>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane
                label="项目分布"
                name="first"
                style="width: 100%; height: 500px"
              >
                <China
                  id="map2"
                  :handleMapData="handleProjectMapData"
                  v-if="activeName === 'first'"
                  :scene="scene"
                ></China
              ></el-tab-pane>
              <el-tab-pane
                label="设备分布"
                name="second"
                style="width: 100%; height: 500px"
              >
                <China
                  id="map3"
                  :handleMapData="handleDeviceMapData"
                  v-if="activeName === 'second'"
                  :scene="scene"
                ></China>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}Top10省份</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template default>
            <div class="general_flex">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <ReArea
                    @fromChildArea="getTop10ProvinceAreaData"
                    ref="areaRef"
                    :handleArea="handleArea"
                    :leaf="1"
                  ></ReArea>
                </el-form-item>
                <el-form-item>
                  <el-select
                    placeholder="请选择硬件类型"
                    v-model="top10ProvinceAdress.hardware"
                    @change="handleTop10ProvinceList"
                  >
                    <el-option value="" label="">全部</el-option>
                    <el-option
                      v-for="item in overviewHardType"
                      :key="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    placeholder="请选择软件类型"
                    v-model="top10ProvinceAdress.software"
                    @change="handleTop10ProvinceList"
                  >
                    <el-option value="" label="">全部</el-option>
                    <el-option
                      v-for="item in overviewDevices"
                      :key="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="exportProvince">导出</el-button>
            </div>
            <el-table
              style="width: 100%"
              :data="top10ProvinceList"
              row-class-name="tableRowClassName"
            >
              <el-table-column
                label="省份名称"
                prop="area"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已激活设备量"
                prop="activeRobot"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已激活设备总量"
                prop="devCount"
                align="center"
              ></el-table-column>
              <el-table-column label="项目总量/有效项目量" align="center">
                <template slot-scope="scope">
                  {{ scope.row.totalProCount }}/{{ scope.row.validProCount }}
                </template>
              </el-table-column>
              <el-table-column label="主要硬件类型/占比" align="center">
                <template slot-scope="scope">
                  {{ scope.row.deviceType }}/{{ scope.row.devicePercent }}%
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}Top10项目</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template #default>
            <div class="general_flex">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <ReArea
                    @fromChildArea="getTop10ProjectAreaData"
                    ref="areaRef"
                    :handleArea="handleArea"
                  ></ReArea>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="exportProject">导出</el-button>
            </div>
            <el-table
              style="width: 100%"
              :data="top10ProjectList"
              row-class-name="tableRowClassName"
            >
              <el-table-column
                label="项目名称"
                prop="projectName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已激活设备量"
                prop="activeRobot"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已激活设备总量"
                prop="robotTotal"
                align="center"
              ></el-table-column>
              <el-table-column
                label="场景"
                prop="projectScene"
                align="center"
              ></el-table-column>
              <el-table-column label="地区" align="center">
                <template slot-scope="scope">
                  {{ scope.row.province }}{{ scope.row.city }}
                </template>
              </el-table-column>
              <el-table-column label="主要硬件类型/比例" align="center">
                <template slot-scope="scope">
                  {{ scope.row.deviceType }}/{{ scope.row.typePercent }}%
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
      >
        <el-card>
          <template #header>
            <span>{{ sceneTitle }}Top10城市</span>
            <tool-tip :content="tip"></tool-tip>
          </template>
          <template default>
            <div class="general_flex">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <ReArea
                    @fromChildArea="getTop10CityAreaData"
                    ref="areaRef"
                    :handleArea="handleArea"
                  ></ReArea>
                </el-form-item>
                <el-form-item>
                  <el-select
                    placeholder="请选择硬件类型"
                    v-model="top10CityAdress.hardware"
                    @change="handleTop10CityList"
                  >
                    <el-option value="" label="">全部</el-option>
                    <el-option
                      v-for="item in overviewHardType"
                      :key="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    placeholder="请选择软件类型"
                    v-model="top10CityAdress.software"
                    @change="handleTop10CityList"
                  >
                    <el-option value="" label="">全部</el-option>
                    <el-option
                      v-for="item in overviewDevices"
                      :key="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="exportCity">导出</el-button>
            </div>
            <el-table
              style="width: 100%"
              :data="top10CityList"
              row-class-name="tableRowClassName"
            >
              <el-table-column
                label="城市名称"
                prop="area"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已激活设备量"
                prop="activeRobot"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已激活设备总量"
                prop="devCount"
                align="center"
              ></el-table-column>
              <el-table-column label="项目总量/有效项目量" align="center">
                <template slot-scope="scope">
                  {{ scope.row.totalProCount }}/{{ scope.row.validProCount }}
                </template>
              </el-table-column>
              <el-table-column label="主要硬件类型/占比" align="center">
                <template slot-scope="scope">
                  {{ scope.row.deviceType }}/{{ scope.row.devicePercent }}%
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ToolTip from "@/components/ToolTip";
import ReArea from "@/components/ReArea";
import China from "@/components/ReChina";
import TimeSelect from "@/components/TimeSelect";
import Pagination from "@/components/Pagination";
import { splitNumber, deepClone } from "@/utils";
import { getCurrentDate, userExport, reset } from "@/utils/tool.js";
import { ReLine, ReCircle, ReBar } from "@/components/ReCharts";
import {
  getOverviewBase,
  getArea,
  getSceneOption,
  getDeviceOption,
  getHardDeviceOption,
  getProjectOption,
  getVersionOption,
  getOverviewCard,
  getOverviewTrend,
  getSellModelData,
  getVersionModelData,
  getDeviceModel,
  getSceneList,
  getAiVoice,
  getAiVoiceHour,
  getTop10CityList,
  getTop10ProjectList,
  getTop10ProvinceList,
  getDeviceMap,
  getProjectMap,
} from "@/api/projectData";
export default {
  components: {
    ToolTip,
    China,
    ReLine,
    ReCircle,
    ReBar,
    ReArea,
    TimeSelect,
    Pagination,
  },
  data() {
    return {
      collapseTitle: "展开数据明细",
      sceneTitle: "",
      chartsTimeData: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      scene: "",
      tip:
        `1.已激活设备量仅统计已激活的设备量<br>
        2.已激活设备总量包含已激活、已过期和未使用设备<br>
        3.项目总量为所有项目<br>
       4.有效项目量为仅统计有已激活（不含过期 未使用）的设备的项目<br>
        统计数据日期截止到` + getCurrentDate(1),
      aiTip: "统计数据截止到" + getCurrentDate(1) + ",累计统计最近30天数据",
      handleDeviceMapData: getDeviceMap,
      handleProjectMapData: getProjectMap,
      handleArea: getArea,

      overviewScenes: [],
      overviewDevices: [],
      overviewProjects: [],
      overviewHardType: [],
      // overviewSoftType: [],
      overviewVersion: [],
      overviewVersions: "",
      overviewInfo: {
        dateRange: [],
        beginDate: getCurrentDate(30 * 24),
        endDate: getCurrentDate(1),
        scene: "",
        region: "",
        province: "",
        city: "",
        hardType: "",
        softType: "",
        version: "",
      },
      sellModelInfo: {
        projectName: "",
        city: "",
        region: "",
        province: "",
        scenes: [],
      },
      versionModelInfo: {
        deviceType: "",
        city: "",
        region: "",
        province: "",
        projectName: "",
        version: "",
      },
      top10ProjectInfo: {
        region: "",
        province: "",
        city: "",
        scene: "",
      },
      deviceModelInfo: {
        projectName: "",
        region: "",
        province: "",
        city: "",
        scenes: [],
        deviceType: "",
      },
      sceneList: [],
      top10CityList: [],
      top10ProvinceList: [],
      top10ProjectList: [],
      sceneAdress: {
        region: "",
        province: "",
        city: "",
      },
      top10ProvinceAdress: {
        region: "",
        province: "",
        software: "",
        hardware: "",
      },
      top10CityAdress: {
        region: "",
        province: "",
        city: "",
        software: "",
        hardware: "",
      },
      overviewBase: {
        activeDeveice: "",
        activeTotal: "",
        validPro: "",
        totalPro: "",
        regionVO: "",
      },
      overviewTable: {
        header: [
          {
            dt: "日期",
            projectValid: "有效项目量",
            projectTotal: "项目总量",
            increProject: "当日新增项目量",
            increRobot: "当日新增设备",
            activeRobotTotal: "已激活设备量",
            robotTotal: "已激活设备总量",
          },
        ],
        total: 0,
        pageNo: 1,
        pageSize: 10,
        list: [],
      },
      cardInfo: {
        curProject7d: "",
        curProject30d: "",
        curRobot7d: "",
        curRobot30d: "",
        increProject: "",
        increProjectAdd: "",
        increRobot: "",
        increRobotAdd: "",
      },
      aiFilterInfo: {
        deviceType: "",
        region: "",
        province: "",
        city: "",
        projectName: "",
        version: "",
      },
      aiVoiceInfo: {
        todayVoiceCount: "",
        totalInValidVoiceCount: "",
        totalValidVoiceCount: "",
        totalVoiceCount: "",
        validVoiceRate: "",
        yesterdayVoiceCount: "",
        yesterdayVoiceCountAdd: "",
      },
      aiVoiceHourInfo: {},
      listData: [],
      barXData: [],
      barSeries: [],
      trendXData: [],
      trendSeries: [],
      colorList: ["#3BA0FF", "#36CBCB"],
      versionModelChart: [],
      sellModelChart: [],
      deviceModelChart: [],
      circleColors: [
        "#3BA0FF",
        "#36CBCB",
        "#4DCB73",
        "#FAD337",
        "#F2637B",
        "#975FE4",
        "#FFA15A",
      ],
      barColors: ["#1890FF"],
      legend: {
        x: "center",
        y: "bottom",
        data: ["已激活设备总量", "项目总量"],
      },
      activeName: "first",
      currentData: [],
      queryInfor: {},
      chartData: [
        { value: 1079, name: "watchers" },
        { value: 1079, name: "star" },
        { value: 204, name: "forks" },
        { value: 3, name: "open_issues" },
      ],
    };
  },
  methods: {
    initData() {
      this.setOverviewBase();
      this.setOverviewScenes();
      this.setOverviewDevices();
      this.setOverviewHardDevices();
      this.setOverviewVersions();
      this.setOverviewCard();
      this.setAiVoiceInfo();
      this.handleAiBar();
      this.handleOverview();
      this.handleSellModel();
      this.handleVersionModel();
      this.handleDeviceModel();
      this.handleSceneList();
      this.handleTop10CityList();
      this.handleTop10ProjectList();
      this.handleTop10ProvinceList();
    },
    async changeVersion(input) {
      let { data } = await getVersionOption({ version: input });
      this.overviewVersion = data;
    },
    async querySearchAsync(queryString, cb) {
      var restaurants = [];
      if (queryString) {
        const { data } = await getProjectOption({ projectName: queryString });
        restaurants = data.map((item) => {
          return { value: item };
        });
      }
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return state.value.indexOf(queryString) > -1;
      };
    },
    async setOverviewBase() {
      const { data } = await getOverviewBase({ scene: this.scene });
      const { activeDevCount, activeProCount, devCount, proCount, regionVO } =
        data;
      this.overviewBase.activeDeveice = splitNumber(activeDevCount, 3); // 已激活设备量
      this.overviewBase.activeTotal = splitNumber(devCount, 3); // 已激活设备总量
      this.overviewBase.validPro = splitNumber(activeProCount, 3); // 有效项目量
      this.overviewBase.totalPro = splitNumber(proCount, 3); // 项目总量
      this.overviewBase.regionVO = regionVO;
    },
    async setOverviewScenes() {
      const { data } = await getSceneOption();
      this.overviewScenes = data;
    },
    async setOverviewDevices() {
      const { data } = await getDeviceOption();
      this.overviewDevices = data;
    },

    async setOverviewHardDevices() {
      const { data } = await getHardDeviceOption();
      this.overviewHardType = data;
    },

    async setOverviewProjects() {
      const { data } = await getProjectOption();
      this.overviewProjects = data;
    },
    async setOverviewVersions() {
      const { data } = await getVersionOption();
      this.overviewVersions = data;
    },
    async setOverviewCard() {
      const {
        beginDate,
        endDate,
        region,
        province,
        city,
        scene,
        softType,
        version,
        hardType,
      } = this.overviewInfo;
      const { data } = await getOverviewCard({
        beginDate,
        endDate,
        region,
        province,
        city,
        scene: scene ? scene : this.scene,
        software: softType,
        hardware: hardType,
        version,
      });
      this.cardInfo.curProject7d = splitNumber(data.curProject7d, 3);
      this.cardInfo.curProject30d = splitNumber(data.curProject30d, 3);
      this.cardInfo.curRobot7d = splitNumber(data.curRobot7d, 3);
      this.cardInfo.curRobot30d = splitNumber(data.curRobot30d, 3);
      this.cardInfo.increProject = splitNumber(data.increProject, 3);
      this.cardInfo.increProjectAdd = data.increProjectAdd;
      this.cardInfo.increRobot = splitNumber(data.increRobot, 3);
      this.cardInfo.increRobotAdd = data.increRobotAdd;
    },
    async setAiVoiceInfo() {
      const { region, province, city, deviceType, projectName, version } =
        this.aiFilterInfo;

      const { data } = await getAiVoice({
        region,
        province,
        city,
        deviceType,
        projectName,
        version,
        scene: this.scene,
      });
      this.aiVoiceInfo.yesterdayVoiceCount = splitNumber(
        data.yesterdayVoiceCount,
        3
      );
      this.aiVoiceInfo.yesterdayVoiceCountAdd = splitNumber(
        data.yesterdayVoiceCountAdd,
        3
      );
      this.aiVoiceInfo.todayVoiceCount = splitNumber(data.todayVoiceCount, 3);
      this.aiVoiceInfo.totalVoiceCount = splitNumber(data.totalVoiceCount, 3);
      this.aiVoiceInfo.totalValidVoiceCount = splitNumber(
        data.totalValidVoiceCount,
        3
      );
      this.aiVoiceInfo.validVoiceRate = splitNumber(data.validVoiceRate, 3);
      this.aiVoiceInfo.totalInValidVoiceCount = splitNumber(
        data.totalInValidVoiceCount,
        3
      );
    },
    async handleOverview() {
      const {
        beginDate,
        endDate,
        region,
        province,
        city,
        scene,
        softType,
        hardType,
        version,
      } = this.overviewInfo;
      const { data } = await getOverviewTrend({
        beginDate: beginDate ? beginDate : getCurrentDate(30 * 24),
        endDate: endDate ? endDate : getCurrentDate(1),
        region,
        province,
        city,
        scene: scene ? scene : this.scene,
        software: softType,
        hardware: hardType,
        version,
      });
      this.overviewTable.total = data.length;
      this.listData = deepClone(data).reverse();
      const { pageNo, pageSize } = this.overviewTable;
      this.overviewTable.list = this.listData.slice(pageNo - 1, pageSize);
      this.trendXData = data.map((item) => item.dt);
      this.trendSeries = [];
      this.trendSeries.push({
        name: "已激活设备总量",
        type: "line",
        data: data.map((item) => item.robotTotal),
      });
      this.trendSeries.push({
        name: "项目总量",
        type: "line",
        data: data.map((item) => item.projectTotal),
      });
    },
    async handleSellModel() {
      const { projectName, province, city, region, scenes } =
        this.sellModelInfo;
      const { data } = await getSellModelData({
        projectName,
        province,
        city,
        region,
        scenes: scenes.length > 0 ? scenes.join(",") : this.scene,
      });
      this.sellModelChart = data.map((item) => {
        return {
          name: item.type,
          value: item.devCount,
        };
      });
    },
    async handleVersionModel() {
      const { region, province, city, projectName, version, deviceType } =
        this.versionModelInfo;
      const scene = this.scene;
      const { data } = await getVersionModelData({
        region,
        province,
        city,
        projectName,
        version,
        deviceType,
        scene,
      });
      // console.log(data);
      this.versionModelChart = data.map((item) => {
        return {
          name: item.deviceType + `${item.version ? item.version : ""}`,
          value: item.num,
        };
      });
    },
    async handleDeviceModel() {
      const { projectName, region, province, city, scenes, deviceType } =
        this.deviceModelInfo;
      const { data } = await getDeviceModel({
        projectName,
        province,
        city,
        region,
        scenes: scenes.length > 0 ? scenes.join(",") : this.scene,
        deviceType,
      });
      this.deviceModelChart = data.map((item) => {
        return {
          name: item.type,
          value: item.devCount,
        };
      });
    },
    async handleAiBar() {
      const { data } = await getAiVoiceHour();
      const barData = data.map((item) => item.count);
      this.barXData = this.chartsTimeData.filter(
        (item, index) => index < data.length
      );
      this.barSeries = [];
      this.barSeries.push({
        barWidth: 9,
        data: barData,
        name: "语音交互次数",
        type: "bar",
      });
      // console.log(this.barDataX, this.barSeries);
    },
    async handleSceneList() {
      const { region, province, city } = this.sceneAdress;
      const { data } = await getSceneList({ region, province, city });
      this.sceneList = data;
    },
    async handleTop10CityList() {
      const { region, province, city, software, hardware } =
        this.top10CityAdress;
      const { data } = await getTop10CityList({
        region,
        province,
        city,
        scene: this.scene,
        software,
        hardware,
      });
      this.top10CityList = data;
    },
    async handleTop10ProvinceList() {
      const { region, province, software, hardware } = this.top10ProvinceAdress;
      const { data } = await getTop10ProvinceList({
        region,
        province,
        scene: this.scene,
        software,
        hardware,
      });
      this.top10ProvinceList = data;
    },
    async handleTop10ProjectList() {
      const { region, province, city, scene } = this.top10ProjectInfo;
      const { data } = await getTop10ProjectList({
        region,
        province,
        city,
        scene: scene ? scene : this.scene,
      });
      this.top10ProjectList = data;
    },
    handleClick(tab, event) {},
    getInforData() {
      this.copyQueryInfor = { ...this.queryInfor };
      this.pageInfor = {
        pageSize: 10,
        pageNo: 1,
      };
      return { ...this.queryInfor };
    },
    getOverviewAreaData(arr) {
      if (arr[0] == "全国") {
        this.overviewInfo.region = "";
        this.overviewInfo.province = "";
        this.overviewInfo.city = "";
      } else if (arr[1] == "全部") {
        this.overviewInfo.region = arr[0];
        this.overviewInfo.province = "";
        this.overviewInfo.city = "";
      } else if (arr[2] == "全部") {
        this.overviewInfo.region = arr[0];
        this.overviewInfo.province = arr[1];
        this.overviewInfo.city = "";
      } else {
        this.overviewInfo.region = arr[0];
        this.overviewInfo.province = arr[1];
        this.overviewInfo.city = arr[2];
      }
    },
    getSellModelAreaData(arr) {
      if (arr[0] == "全国") {
        this.sellModelInfo.region = "";
        this.sellModelInfo.province = "";
        this.sellModelInfo.city = "";
      } else if (arr[1] == "全部") {
        this.sellModelInfo.region = arr[0];
        this.sellModelInfo.province = "";
        this.sellModelInfo.city = "";
      } else if (arr[2] == "全部") {
        this.sellModelInfo.region = arr[0];
        this.sellModelInfo.province = arr[1];
        this.sellModelInfo.city = "";
      } else {
        this.sellModelInfo.region = arr[0];
        this.sellModelInfo.province = arr[1];
        this.sellModelInfo.city = arr[2];
      }
      this.handleSellModel();
    },
    getDeviceModelAreaData(arr) {
      if (arr[0] == "全国") {
        this.deviceModelInfo.region = "";
        this.deviceModelInfo.province = "";
        this.deviceModelInfo.city = "";
      } else if (arr[1] == "全部") {
        this.deviceModelInfo.region = arr[0];
        this.deviceModelInfo.province = "";
        this.deviceModelInfo.city = "";
      } else if (arr[2] == "全部") {
        this.deviceModelInfo.region = arr[0];
        this.deviceModelInfo.province = arr[1];
        this.deviceModelInfo.city = "";
      } else {
        this.deviceModelInfo.region = arr[0];
        this.deviceModelInfo.province = arr[1];
        this.deviceModelInfo.city = arr[2];
      }
      this.handleDeviceModel();
    },
    getAiVoiceAreaData(arr) {
      if (arr[0] == "全国") {
        this.aiFilterInfo.region = "";
        this.aiFilterInfo.province = "";
        this.aiFilterInfo.city = "";
      } else if (arr[1] == "全部") {
        this.aiFilterInfo.region = arr[0];
        this.aiFilterInfo.province = "";
        this.aiFilterInfo.city = "";
      } else if (arr[2] == "全部") {
        this.aiFilterInfo.region = arr[0];
        this.aiFilterInfo.province = arr[1];
        this.aiFilterInfo.city = "";
      } else {
        this.aiFilterInfo.region = arr[0];
        this.aiFilterInfo.province = arr[1];
        this.aiFilterInfo.city = arr[2];
      }
      this.setAiVoiceInfo();
    },
    getSceneAreaData(arr) {
      if (arr[0] == "全国") {
        this.sceneAdress.region = "";
        this.sceneAdress.province = "";
        this.sceneAdress.city = "";
      } else if (arr[1] == "全部") {
        this.sceneAdress.region = arr[0];
        this.sceneAdress.province = "";
        this.sceneAdress.city = "";
      } else if (arr[2] == "全部") {
        this.sceneAdress.region = arr[0];
        this.sceneAdress.province = arr[1];
        this.sceneAdress.city = "";
      } else {
        this.sceneAdress.region = arr[0];
        this.sceneAdress.province = arr[1];
        this.sceneAdress.city = arr[2];
      }
      this.handleSceneList();
    },
    getVersionAreaData(arr) {
      if (arr[0] == "全国") {
        this.versionModelInfo.region = "";
        this.versionModelInfo.province = "";
        this.versionModelInfo.city = "";
      } else if (arr[1] == "全部") {
        this.versionModelInfo.region = arr[0];
        this.versionModelInfo.province = "";
        this.versionModelInfo.city = "";
      } else if (arr[2] == "全部") {
        this.versionModelInfo.region = arr[0];
        this.versionModelInfo.province = arr[1];
        this.versionModelInfo.city = "";
      } else {
        this.versionModelInfo.region = arr[0];
        this.versionModelInfo.province = arr[1];
        this.versionModelInfo.city = arr[2];
      }
      this.handleVersionModel();
    },
    getTop10CityAreaData(arr) {
      if (arr[0] == "全国") {
        this.top10CityAdress.region = "";
        this.top10CityAdress.province = "";
        this.top10CityAdress.city = "";
      } else if (arr[1] == "全部") {
        this.top10CityAdress.region = arr[0];
        this.top10CityAdress.province = "";
        this.top10CityAdress.city = "";
      } else if (arr[2] == "全部") {
        this.top10CityAdress.region = arr[0];
        this.top10CityAdress.province = arr[1];
        this.top10CityAdress.city = "";
      } else {
        this.top10CityAdress.region = arr[0];
        this.top10CityAdress.province = arr[1];
        this.top10CityAdress.city = arr[2];
      }
      this.handleTop10CityList();
    },
    getTop10ProjectAreaData(arr) {
      if (arr[0] == "全国") {
        this.top10ProjectInfo.region = "";
        this.top10ProjectInfo.province = "";
        this.top10ProjectInfo.city = "";
      } else if (arr[1] == "全部") {
        this.top10ProjectInfo.region = arr[0];
        this.top10ProjectInfo.province = "";
        this.top10ProjectInfo.city = "";
      } else if (arr[2] == "全部") {
        this.top10ProjectInfo.region = arr[0];
        this.top10ProjectInfo.province = arr[1];
        this.top10ProjectInfo.city = "";
      } else {
        this.top10ProjectInfo.region = arr[0];
        this.top10ProjectInfo.province = arr[1];
        this.top10ProjectInfo.city = arr[2];
      }
      this.handleTop10ProjectList();
    },
    getTop10ProvinceAreaData(arr) {
      if (arr[0] == "全国") {
        this.top10ProvinceAdress.region = "";
        this.top10ProvinceAdress.province = "";
      } else if (arr[1] == "全部") {
        this.top10ProvinceAdress.region = arr[0];
        this.top10ProvinceAdress.province = "";
      } else if (arr[2] == "全部") {
        this.top10ProvinceAdress.region = arr[0];
        this.top10ProvinceAdress.province = arr[1];
      } else {
        this.top10ProvinceAdress.region = arr[0];
        this.top10ProvinceAdress.province = arr[1];
      }
      this.handleTop10ProvinceList();
    },
    changePeriod(val) {
      if (val != -1) {
        this.overviewInfo.beginDate = getCurrentDate(val * 24);
        this.overviewInfo.endDate = getCurrentDate(1);
      } else {
        this.overviewBase.dateRange = [];
      }
    },
    changeDateRange(val) {
      this.overviewInfo.beginDate = val[0];
      this.overviewInfo.endDate = val[1];
    },
    useReset() {
      reset(this.overviewInfo);
      this.handleOverview();
      this.setOverviewCard();
    },
    overviewTurnPage(val) {
      this.overviewTable.pageNo = val;
      const { pageSize } = this.overviewTable;
      const that = this;
      const start = pageSize * val - pageSize;
      const end = pageSize * val;
      if (that.listData.length <= pageSize) {
        that.overviewTable.list = that.listData;
      } else {
        if (pageSize * val >= that.listData.length) {
          that.overviewTable.list = that.listData.slice(start);
        } else {
          that.overviewTable.list = that.listData.slice(start, end);
        }
      }
    },
    overviewSizeChange(val) {
      this.overviewTable.pageSize = val;
      this.overviewTable.pageNo = 1;
      const { pageNo, pageSize } = this.overviewTable;
      this.overviewTable.list = this.listData.slice(pageNo - 1, pageSize);
    },
    sceneTurnPage(val) {},
    sceneSizeChange(val) {},
    exportData() {
      const {
        beginDate,
        endDate,
        region,
        province,
        city,
        scene,
        hardType,
        softType,
        version,
      } = this.overviewInfo;
      const url = `/projectoverview/overview/trend/export?beginDate=${beginDate}&endDate=${endDate}&region=${region}&province=${province}&city=${city}&scene=${this.scene}&hardware=${hardType}&software=${softType}&version=${version}&fileName=概览数据`;
      userExport(url);
    },
    exportProvince() {
      const { region, province, software, hardware } = this.top10ProvinceAdress;
      const scene = this.scene;
      const address = "-" + (province ? province : region);
      const fileName = `${scene}概览${address}-Top10省份`;
      const url = `/projectoverview/top10province/export?region=${region}&province=${province}&scene=${scene}&software=${software}&hardware=${hardware}&fileName=top10省份`;
      userExport(url, fileName);
    },
    exportProject() {
      const { region, province, city } = this.top10ProjectInfo;
      const scene = this.scene;
      const address = "-" + (city ? city : province ? province : region);
      const fileName = `${scene}概览${address}-Top10项目`;
      const url = `/projectoverview/top10project/export?region=${region}&province=${province}&city=${city}&scene=${scene}&fileName=top10项目`;
      userExport(url, fileName);
    },
    exportCity() {
      const { region, province, city, software, hardware } =
        this.top10CityAdress;
      const scene = this.scene;
      const address = "-" + (city ? city : province ? province : region);
      const fileName = `${scene}概览${address}-Top10城市`;
      const url = `/projectoverview/top10city/export?region=${region}&province=${province}&city=${city}&scene=${scene}&software=${software}&hardware=${hardware}&fileName=top10城市`;
      userExport(url, fileName);
    },
    getKeys(overviewTable) {
      if (this[overviewTable].header.length != 0) {
        return Object.keys(this[overviewTable].header[0]);
      }
    },
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: "/general-data" });
      } else {
        this.$router.go(-1);
      }
    },
    handleChange(val) {
      this.collapseTitle = val.length > 0 ? "收起数据明细" : "展开数据明细";
    },
  },
  created() {
    if (this.$route.query) {
      const { scene } = this.$route.query;
      this.scene = scene;
      this.sceneTitle = scene + "场景";
    }
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.margin-bottom {
  display: block;
  margin-bottom: 15px;
}
.circle {
  padding: 30px;
}
.general_data_contain {
  width: 100%;
  .collapseText {
    ::v-deep .el-collapse-item__header {
      color: #409eff;
    }
  }
  .general_flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .generl_info,
  .ai_info {
    text-align: center;
    .title {
      color: #111;
      margin-bottom: 20px;
      font-weight: 400;
    }
    .compare,
    .active {
      margin-bottom: 14px;
      color: #999;
      font-size: 12px;
    }
    .count {
      font-size: 24px;
      color: rgb(59, 160, 255);
    }
  }
  .total_count {
    margin-top: 30px 40px;
    .title {
      font-size: 14px;
      margin-bottom: 20px;
      font-weight: 400;
    }
    .count {
      font-size: 24px;
      color: rgb(59, 160, 255);
      margin-bottom: 15px;
    }
  }
  .tag-group__title {
    margin-bottom: 18px;
    display: block;
  }
  .tag_list {
    display: flex;
    justify-content: space-between;
    .tag_item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140px;
      border: 1px solid #2194e0;
      text-align: center;
      height: 60px;
      color: #2194e0;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: #2194e0;
        color: #fff;
      }
    }
  }
  .list_container {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    background-color: #fff;
    .list_top {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 18px;
      align-items: center;
    }
  }
}
</style>
